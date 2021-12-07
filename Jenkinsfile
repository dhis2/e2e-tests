@Library('pipeline-library') _
pipeline {
  agent any
  options { disableConcurrentBuilds() }
  environment {
    VERSION = "newdemos"
    INSTANCE_NAME = "dev/${VERSION}"
    INSTANCE_DOMAIN = "https://demos.dhis2.org"
    INSTANCE_URL = ""
    GIT_URL = "https://github.com/dhis2/e2e-tests/"
    USERNAME = "$BROWSERSTACK_USERNAME"
    KEY = "$BROWSERSTACK_KEY"
    AWX_BOT_CREDENTIALS = credentials('awx-bot-user-credentials')
    BRANCH_PATH = "${getBranchPath()}"
    ALLURE_REPORT_DIR_PATH = "${BRANCH_PATH}/allure"
    ALLURE_RESULTS_DIR = "reports/allure-results"
    ALLURE_REPORT_DIR = "allure-report-$VERSION"
    APPLITOOLS_API_KEY = "$APPLITOOLS_API_KEY"
    JIRA_ENABLED = false
  }

  tools {
    nodejs "node"
  }

  triggers {
    cron(env.BRANCH_NAME.contains('-packages') ? '' : 'H 1 * * *')
  }

  stages {
    stage('Configure job') {
      when {
        buildingTag()
      }

      steps {
        script {
          VERSION = "${env.BRANCH_NAME}".split("-")[0]
          INSTANCE_NAME = "${env.BRANCH_NAME}"
          BRANCH_PATH = "${getBranchPath(true)}"
          ALLURE_REPORT_DIR_PATH = "${BRANCH_PATH}/allure"
        }
      }

    }
    stage('Prepare reports dir') {
      steps {
        script {
          if (!fileExists("$ALLURE_REPORT_DIR_PATH")) {
            sh "mkdir $ALLURE_REPORT_DIR_PATH"
          }
          if (fileExists("$ALLURE_RESULTS_DIR")) {
            dir("$ALLURE_RESULTS_DIR", {
              deleteDir()
            })
          }

          sh "mkdir -p ${WORKSPACE}/$ALLURE_RESULTS_DIR"

          if (fileExists("$ALLURE_REPORT_DIR_PATH/$ALLURE_REPORT_DIR/history")) {
            sh "cp  -r $ALLURE_REPORT_DIR_PATH/$ALLURE_REPORT_DIR/history ${WORKSPACE}/$ALLURE_RESULTS_DIR/history"
            sh "cp  -r $ALLURE_REPORT_DIR_PATH/$ALLURE_REPORT_DIR/data ${WORKSPACE}/$ALLURE_RESULTS_DIR/data"
          }
        }
      }
    }

    stage('Build') {

      steps {
        sh "npm install"
        sh "BASE_URL=\"${INSTANCE_URL}\" npm run browserstack"
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

    failure {
      script {
        def prefix = ""
        if (fileExists('./reports/new_failures.json')) {
          prefix = "NEW ERRORS FOUND! "
        }

         slackSend(
            color: '#ff0000',
            message: "${prefix}E2E tests initialized from branch $GIT_BRANCH for version - $VERSION failed. Please visit " + env.BUILD_URL + " for more information",
            channel: '@Gintare;@Hella Dawit'
        )
      }
    }
  }
}
