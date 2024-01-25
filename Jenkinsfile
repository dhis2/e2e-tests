@Library('pipeline-library') _

boolean isOnMasterOrMaintenanceVersionBranch = env.BRANCH_NAME == "master" || env.BRANCH_NAME.startsWith("v")

def uploadNewDatabase(String groupName, String version) {
  def databaseName = "${version}.sql.gz"

  echo "Downloading database for $version"
  sh "curl -f https://databases.dhis2.org/sierra-leone/$version/dhis2-db-sierra-leone.sql.gz -o \"$databaseName\""

  return sh(
      returnStdout: true,
      script: "./upload.sh $groupName \"sierra-leone/$databaseName\" $databaseName | jq -r '.id'"
  ).trim()
}

def findDatabaseId(String groupName, String version) {
  return sh(
      returnStdout: true,
      script: "./list.sh | jq -r '.[] | select(.name == \"$groupName\") .databases[] | select(.name == \"sierra-leone/${version}.sql.gz\") .id'"
  ).trim()
}

pipeline {
  agent {
    label 'ec2-jdk11'
  }

  options {
    ansiColor('xterm')
  }

  parameters {
    booleanParam(name: 'keep_instance_alive', defaultValue: false, description: 'Keep the instance alive after the build is done.')
    string(name: 'keep_instance_alive_for', defaultValue: '300', description: 'Duration (in minutes) to keep the intance alive for.')
    string(name: 'instance_readiness_threshold', defaultValue: '15', description: 'Duration (in minutes) to wait for the instance to get ready.')
  }

  environment {
    TARGET_BRANCH = "${env.CHANGE_ID ? env.CHANGE_TARGET : env.GIT_BRANCH}"
    REF_BASED_VERSION = "${env.TAG_NAME ? env.TAG_NAME : '2.' + env.TARGET_BRANCH.replaceAll('v', '')}"
    DHIS2_VERSION = "${env.TARGET_BRANCH == 'master' ? 'dev' : env.REF_BASED_VERSION.replaceAll('-rc', '')}"
    IMAGE_TAG = "${env.TARGET_BRANCH == 'master' ? 'latest' : env.REF_BASED_VERSION}"
    IMAGE_REPOSITORY = "${env.TAG_NAME ? 'core' : 'core-dev'}"
    IM_REPO_URL = 'https://github.com/dhis2-sre/im-manager'
    IM_ENVIRONMENT = 'im.dhis2.org'
    IM_HOST = "https://api.$IM_ENVIRONMENT"
    INSTANCE_GROUP_NAME = 'qa'
    DATABASE_GROUP_NAME = 'test-dbs'
    INSTANCE_NAME = "e2e-cy-${env.GIT_BRANCH.replaceAll("\\P{Alnum}", "").toLowerCase()}-$BUILD_NUMBER"
    INSTANCE_DOMAIN = "https://${INSTANCE_GROUP_NAME}.$IM_ENVIRONMENT"
    INSTANCE_URL = "$INSTANCE_DOMAIN/$INSTANCE_NAME"
    INSTANCE_READINESS_THRESHOLD_ENV = "${params.instance_readiness_threshold}"
    INSTANCE_TTL = "${params.keep_instance_alive ? params.keep_instance_alive_for.toInteger() * 60 : ''}"
    STARTUP_PROBE_FAILURE_THRESHOLD = 50
    CORE_RESOURCES_REQUESTS_CPU = '450m'
    DB_RESOURCES_REQUESTS_CPU = '450m'
    DHIS2_CREDENTIALS = credentials('dhis2-default')
    ALLURE_REPORT_DIR_PATH = 'allure'
    ALLURE_RESULTS_DIR = 'reports/allure-results'
    ALLURE_REPORT_DIR = "allure-report-$DHIS2_VERSION"
    JIRA_RELEASE_VERSION_NAME = "${env.TAG_NAME ? env.DHIS2_VERSION : sh(script: './get_next_version.sh', returnStdout: true)}"
    HTTP = 'https --check-status'
  }

  triggers {
    cron(isOnMasterOrMaintenanceVersionBranch ? 'H 6 * * 1-5' : '')
  }

  stages {
    stage('Create DHIS2 instance') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'e2e-im-user', passwordVariable: 'PASSWORD', usernameVariable: 'USER_EMAIL')]) {
            dir('im-manager') {
              gitHelper.sparseCheckout(IM_REPO_URL, "${gitHelper.getLatestTag(IM_REPO_URL)}", '/scripts')

              dir('scripts/databases') {
                env.DATABASE_ID = findDatabaseId(DATABASE_GROUP_NAME, DHIS2_VERSION)

                if (!env.DATABASE_ID) {
                  echo "Couldn't find database for $DHIS2_VERSION"

                  try {
                    env.DATABASE_ID = uploadNewDatabase(DATABASE_GROUP_NAME, DHIS2_VERSION)
                  } catch (err) {
                    echo "Couldn't download database for ${DHIS2_VERSION}: ${err}"

                    DHIS2_SHORT_VERSION = DHIS2_VERSION.split('\\.').take(2).join('.')
                    env.DATABASE_ID = findDatabaseId(DATABASE_GROUP_NAME, DHIS2_SHORT_VERSION)

                    if (!env.DATABASE_ID) {
                      echo "Couldn't find database for $DHIS2_SHORT_VERSION"

                      env.DATABASE_ID = uploadNewDatabase(DATABASE_GROUP_NAME, DHIS2_SHORT_VERSION)
                    }
                  }
                }

                sh '[ -n "$DATABASE_ID" ]'
                echo "DATABASE_ID is $DATABASE_ID"
              }

              dir('scripts/instances') {
                echo 'Creating DHIS2 instance ...'

                sh "./deploy-dhis2.sh $INSTANCE_GROUP_NAME $INSTANCE_NAME"

                timeout(params.instance_readiness_threshold) {
                  waitFor.statusOk("$INSTANCE_URL")
                }

                NOTIFIER_ENDPOINT = dhis2.generateAnalytics("$INSTANCE_URL", '$DHIS2_CREDENTIALS')
                timeout(params.instance_readiness_threshold) {
                  waitFor.analyticsCompleted("${INSTANCE_URL}${NOTIFIER_ENDPOINT}", '$DHIS2_CREDENTIALS')
                }

                sh "credentials=\$DHIS2_CREDENTIALS url=$INSTANCE_URL $WORKSPACE/scripts/install_app_hub_apps.sh"
              }
            }
          }
        }
      }
    }

    stage('Prepare reports dir') {
      steps {
        sh "mkdir -p $ALLURE_REPORT_DIR_PATH"
        sh "mkdir -p $ALLURE_RESULTS_DIR"
      }
    }

    stage('Initialize Data') {
      environment {
        CYPRESS_BASE_URL = "$INSTANCE_URL"
        CYPRESS_LOGIN_CREDENTIALS = credentials('admin_login_credentials')
      }
      steps {
        script {
          sh 'npm install axios'
          sh '''
            export CYPRESS_LOGIN_USERNAME=$(echo $CYPRESS_LOGIN_CREDENTIALS | cut -d: -f1)
            export CYPRESS_LOGIN_PASSWORD=$(echo $CYPRESS_LOGIN_CREDENTIALS | cut -d: -f2)
            node ./scripts/initDataScript.js
          '''
          archiveArtifacts artifacts: 'cypress.env.json', onlyIfSuccessful: true
          sh 'mkdir -p env_files'
          sh 'mv cypress.env.json env_files/'
        }
      }
    }

    stage('Test') {
      environment {
        JIRA_ENABLED = false
        JIRA_USERNAME = "$JIRA_USERNAME"
        JIRA_PASSWORD = "$JIRA_PASSWORD"
        BASE_URL = "$INSTANCE_URL"
        LAUNCH_BRANCH_VERSION = "${env.TARGET_BRANCH}"
        CI_BUILD_ID = "$BUILD_NUMBER"
        RP_TOKEN = credentials('report-portal-access-uuid')
      }

      steps {
        script {
          unarchive mapping: ['cypress.env.json': 'cypress.env.json']
          // assign version to the report portal version attribute and name the launch based on the branch
          def json = sh(
            returnStdout: true,
            script: "jq '.reportportalAgentJsCypressReporterOptions.attributes[0].value=\"${JIRA_RELEASE_VERSION_NAME}\" | .reportportalAgentJsCypressReporterOptions.launch=\"e2e_tests_${env.GIT_BRANCH}\"' reporter-config.json"
          )
          writeFile(text: "$json", file: 'reporter-config.json')

          catchError(message: 'Tests failed', stageResult: 'FAILURE', catchInterruptions: false) {
            sh 'docker-compose up --exit-code-from cypress-tests'
          }

          sh 'python3 merge_rp_launches.py'
        }
      }
    }
  }

  post {
    always {
      script {
        allure([
          includeProperties: true,
          jdk: '',
          properties: [
            [
              key: 'allure.results.directory',
              value: "$ALLURE_RESULTS_DIR"
            ]
          ],
          reportBuildPolicy: 'ALWAYS',
          results: [[path: "$ALLURE_RESULTS_DIR"]],
          report: "$ALLURE_REPORT_DIR_PATH/$ALLURE_REPORT_DIR"
          ])

        if (!params.keep_instance_alive) {
          dir('im-manager/scripts/instances') {
            withCredentials([usernamePassword(credentialsId: 'e2e-im-user', passwordVariable: 'PASSWORD', usernameVariable: 'USER_EMAIL')]) {
              echo 'Deleting DHIS2 instance ...'

              sh "./destroy.sh $INSTANCE_GROUP_NAME $INSTANCE_NAME"
            }
          }
        }
      }
    }

    /*failure {
      script {
        def prefix = ""
        if (fileExists('./reports/new_failures.json')) {
          prefix = 'NEW ERRORS FOUND! '
        }

         slackSend(
           color: '#ff0000',
           message: "${prefix}E2E tests initialized from branch $GIT_BRANCH for version - $DHIS2_VERSION failed. Please visit " + env.BUILD_URL + " for more information",
           channel: '@Haroon;@Hella'
        )
      }
    }*/
  }
}
