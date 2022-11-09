@Library('pipeline-library') _

pipeline {
  agent {
    label 'ec2-jdk11'
  }

  options {
    disableConcurrentBuilds()
    ansiColor('xterm')
  }

  environment {
    GIT_URL = 'https://github.com/dhis2/e2e-tests'
    BRANCH_BASED_VERSION = "${env.TAG_NAME ? env.GIT_BRANCH.split('-')[0] : '2.' + env.GIT_BRANCH.replaceAll('v', '')}"
    DHIS2_VERSION = "${env.GIT_BRANCH == 'DEVOPS-152' ? 'dev' : env.BRANCH_BASED_VERSION}"
    IMAGE_TAG = "${env.GIT_BRANCH == 'DEVOPS-152' ? 'latest' : env.BRANCH_BASED_VERSION}"
    IMAGE_REPOSITORY = "${env.TAG_NAME ? 'core' : 'core-dev'}"
    INSTANCE_NAME = "e2e-cy-${env.GIT_BRANCH.replaceAll("\\P{Alnum}", "").toLowerCase()}-$BUILD_NUMBER"
    INSTANCE_DOMAIN = 'https://whoami.im.dev.test.c.dhis2.org'
    INSTANCE_HOST = 'https://api.im.dev.test.c.dhis2.org'
    INSTANCE_URL = "$INSTANCE_DOMAIN/$INSTANCE_NAME"
    GROUP_NAME = 'whoami'
    ALLURE_REPORT_DIR_PATH = 'allure'
    ALLURE_RESULTS_DIR = 'reports/allure-results'
    ALLURE_REPORT_DIR = "allure-report-$DHIS2_VERSION"
    JIRA_RELEASE_VERSION_NAME = "${env.TAG_NAME ? env.DHIS2_VERSION : sh(script: './get_next_version.sh', returnStdout: true)}"
    HTTP = 'https --check-status'
  }

//  triggers {
//    cron(env.GIT_BRANCH.contains('.') ? '' : 'H 6 * * *')
//  }

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
                  script: "./list.sh | jq -r '.[] | select(.Name == \"$GROUP_NAME\") .Databases[] | select(.Name|contains(\"Sierra Leone - $DHIS2_VERSION\")) .ID'"
              ).trim()

              sh '[ -n "$DATABASE_ID" ]'
              echo "DATABASE_ID is $DATABASE_ID for version $DHIS2_VERSION"
            }

            dir('im-manager/scripts') {
              echo 'Creating DHIS2 instance ...'

              // 1 day
              env.INSTANCE_TTL = sh(returnStdout: true, script: '#!/usr/bin/env bash\necho \$(($EPOCHSECONDS + 86400))').trim()

              sh "./deploy-dhis2.sh $GROUP_NAME $INSTANCE_NAME"

              sh "$WORKSPACE/scripts/generate-analytics.sh $INSTANCE_URL"

              sh "credentials=system:System123 url=$INSTANCE_URL $WORKSPACE/install_app_hub_apps.sh"
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
        CI_BUILD_ID = "$BUILD_NUMBER"
        RP_TOKEN = credentials('report-portal-access-uuid')
      }

      steps {
        script {
          // assign version to the report portal version attribute
          def json = sh(returnStdout: true, script: "jq '.reportportalAgentJsCypressReporterOptions.attributes[0].value=\"${JIRA_RELEASE_VERSION_NAME}\"' reporter-config.json")
          writeFile(text: "$json", file: 'reporter-config.json')
          sh 'docker-compose up --exit-code-from cypress-tests'
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
        }
      }

    success {
      script {
        dir('im-manager/scripts') {
          withCredentials([usernamePassword(credentialsId: 'e2e-im-user', passwordVariable: 'PASSWORD', usernameVariable: 'USER_EMAIL')]) {
            echo 'Deleting DHIS2 instance ...'

            sh "./destroy.sh $GROUP_NAME $INSTANCE_NAME"
          }
        }
      }
    }

    failure {
      script {
        def prefix = ""
        if (fileExists('./reports/new_failures.json')) {
          prefix = 'NEW ERRORS FOUND! '
        }

         slackSend(
           color: '#ff0000',
           message: "${prefix}E2E tests initialized from branch $GIT_BRANCH for version - $DHIS2_VERSION failed. Please visit " + env.BUILD_URL + " for more information",
           channel: '@U01RSD1LPB3'
        )
      }
    }
  }
}
