@Library('pipeline-library') _

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
    REF_BASED_VERSION = "${env.TAG_NAME ? env.TAG_NAME : '2.' + env.GIT_BRANCH.replaceAll('v', '')}"
    DHIS2_VERSION = "${env.GIT_BRANCH == 'master' ? 'dev' : env.REF_BASED_VERSION.replaceAll('-rc', '')}"
    IMAGE_TAG = "${env.GIT_BRANCH == 'master' ? 'latest' : env.REF_BASED_VERSION}"
    IMAGE_REPOSITORY = "${env.TAG_NAME ? 'core' : 'core-dev'}"
    INSTANCE_ENVIRONMENT = 'radnov.test.c.dhis2.org'
    INSTANCE_GROUP_NAME = 'whoami'
    INSTANCE_NAME = "e2e-cy-${env.GIT_BRANCH.replaceAll("\\P{Alnum}", "").toLowerCase()}-$BUILD_NUMBER"
    INSTANCE_DOMAIN = "https://${INSTANCE_GROUP_NAME}.im.$INSTANCE_ENVIRONMENT"
    INSTANCE_HOST = "https://api.im.$INSTANCE_ENVIRONMENT"
    INSTANCE_URL = "$INSTANCE_DOMAIN/$INSTANCE_NAME"
    INSTANCE_READINESS_THRESHOLD_ENV = "${params.instance_readiness_threshold}"
    STARTUP_PROBE_FAILURE_THRESHOLD = 50
    DHIS2_CREDENTIALS = credentials('dhis2-default')
    ALLURE_REPORT_DIR_PATH = 'allure'
    ALLURE_RESULTS_DIR = 'reports/allure-results'
    ALLURE_REPORT_DIR = "allure-report-$DHIS2_VERSION"
    JIRA_RELEASE_VERSION_NAME = "${env.TAG_NAME ? env.DHIS2_VERSION : sh(script: './get_next_version.sh', returnStdout: true)}"
    HTTP = 'https --check-status'
  }

  triggers {
    cron(env.BRANCH_NAME.contains('.') ? '' : 'H 6 * * 1-5')
  }

  stages {
    stage('Checkout IM scripts') {
      steps {
        script {
          dir('im-manager') {
            checkout([
              $class: 'GitSCM',
              branches: [[name: '*/master']],
              extensions: [[$class: 'SparseCheckoutPaths', sparseCheckoutPaths: [[path: '/scripts']]]],
              userRemoteConfigs: [[url: 'https://github.com/dhis2-sre/im-manager']]
            ])
          }

          dir('im-db-manager') {
            checkout([
                $class: 'GitSCM',
                branches: [[name: '*/master']],
                extensions: [[$class: 'SparseCheckoutPaths', sparseCheckoutPaths: [[path: '/scripts']]]],
                userRemoteConfigs: [[url: 'https://github.com/dhis2-sre/im-database-manager']]
            ])
          }
        }
      }
    }

    stage('Create DHIS2 instance') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'e2e-im-user', passwordVariable: 'PASSWORD', usernameVariable: 'USER_EMAIL')]) {
            dir('im-db-manager/scripts') {
              env.DATABASE_ID = sh(
                  returnStdout: true,
                  script: "./list.sh | jq -r '.[] | select(.Name == \"$INSTANCE_GROUP_NAME\") .Databases[] | select(.Name == \"Sierra Leone - ${DHIS2_VERSION}.sql.gz\") .ID'"
              ).trim()

              sh '[ -n "$DATABASE_ID" ]'
              echo "DATABASE_ID is $DATABASE_ID for version $DHIS2_VERSION"
            }

            dir('im-manager/scripts') {
              echo 'Creating DHIS2 instance ...'

              if (params.keep_instance_alive) {
                env.INSTANCE_TTL = sh(returnStdout: true, script: "#!/usr/bin/env bash\necho \$((\$EPOCHSECONDS + 60 * ${params.keep_instance_alive_for}))").trim()
              }

              sh "./deploy-dhis2.sh $INSTANCE_GROUP_NAME $INSTANCE_NAME"

              sh "$WORKSPACE/scripts/generate-analytics.sh \$DHIS2_CREDENTIALS $INSTANCE_URL"

              sh "credentials=\$DHIS2_CREDENTIALS url=$INSTANCE_URL $WORKSPACE/scripts/install_app_hub_apps.sh"
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

    stage('Test') {
      environment {
        JIRA_ENABLED = false
        JIRA_USERNAME = "$JIRA_USERNAME"
        JIRA_PASSWORD = "$JIRA_PASSWORD"
        BASE_URL = "$INSTANCE_URL"
        LAUNCH_BRANCH_VERSION = "${env.GIT_BRANCH}"
        CI_BUILD_ID = "$BUILD_NUMBER"
        RP_TOKEN = credentials('report-portal-access-uuid')
      }

      steps {
        script {
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
          dir('im-manager/scripts') {
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
