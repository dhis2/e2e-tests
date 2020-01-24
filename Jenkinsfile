@Library('pipeline-library') _
pipeline {
  agent any
  options { disableConcurrentBuilds() }
  environment {
    VERSION = "dev"
    INSTANCE_NAME = "${VERSION}_smoke"
    INSTANCE_DOMAIN = "https://smoke.dhis2.org"
    INSTANCE_URL = ""
    GIT_URL = "https://github.com/dhis2/e2e-tests/"
    USERNAME = "$BROWSERSTACK_USERNAME"
    KEY = "$BROWSERSTACK_KEY"
    AWX_BOT_CREDENTIALS = credentials('awx-bot-user-credentials')
    BRANCH_PATH = "${getBranchPath()}"
    ALLURE_REPORT_DIR_PATH = "${BRANCH_PATH}/allure"
    ALLURE_RESULTS_DIR = "./reports/allure-results"
    ALLURE_REPORT_DIR = "allure-report-$VERSION"
    APPLITOOLS_API_KEY = "$APPLITOOLS_API_KEY"
    JIRA_USERNAME = "$JIRA_USERNAME"
    JIRA_PASSWORD = "$JIRA_PASSWORD"
    JIRA_RELEASE_VERSION_NAME = sh(script: './get_next_version.sh', returnStdout: true)
  }

  tools {
    nodejs "node"
  }

  triggers {
    cron(env.BRANCH_NAME.contains('.') ? '' : 'H 5 * * *')
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
          JIRA_RELEASE_VERSION_NAME = "$VERSION"
          echo "Version: $VERSION, JIRA_RELEASE_VERSION_NAME: $JIRA_RELEASE_VERSION_NAME"
        }
      }

    }
    stage('Update instance') {
      steps {
        script {
          INSTANCE_URL = "${INSTANCE_DOMAIN}/${INSTANCE_NAME}/"
          sh "instance_name=$INSTANCE_NAME awx_credentials=$AWX_BOT_CREDENTIALS ./update-instance.sh"
          sh "credentials=system:System123 url=${INSTANCE_URL} ./delete-data.sh"
        } 
      }
    }
    stage('Prepare reports dir') {
      steps {
        script {
          if (!fileExists("$ALLURE_REPORT_DIR_PATH")) {
            sh "mkdir $ALLURE_REPORT_DIR_PATH"
          }
          dir("$ALLURE_RESULTS_DIR", {
            deleteDir()
          })
    
          sh "mkdir ${WORKSPACE}/$ALLURE_RESULTS_DIR"
              
          if (fileExists("$ALLURE_REPORT_DIR_PATH/$ALLURE_REPORT_DIR/history")) {
            sh "cp  -r $ALLURE_REPORT_DIR_PATH/$ALLURE_REPORT_DIR/history ${WORKSPACE}/$ALLURE_RESULTS_DIR/history"
          } 
        } 
      }      
    }

    stage('Build') {
      environment {
        JIRA_RELEASE_VERSION_NAME = "$JIRA_RELEASE_VERSION_NAME"
      }

      steps {
        sh "npm install"
        sh "npm run-script browserstack -- --baseUrl=\"${INSTANCE_URL}\""
      }
    }
  }
    
  post {
    always {
      script {
        allure([
          includeProperties: false,
          jdk: '',
          properties: [],
          reportBuildPolicy: 'ALWAYS',
          results: [[path: "./$ALLURE_RESULTS_DIR"]],
          report: "$ALLURE_REPORT_DIR_PATH/$ALLURE_REPORT_DIR"
          ])  
        }     
      }
      
    failure {
      script {
         if (fileExists('./reports/new_failures.json')) {
          slackSend(
            color: '#ff0000',
            message: "E2E tests initialized from branch $GIT_BRANCH for version - $VERSION has new errors. Please visit " + env.BUILD_URL + " for more information",
            channel: '@Gintare'
          )
        } 
      }
    }
  }
}
