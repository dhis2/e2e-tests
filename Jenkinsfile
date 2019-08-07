pipeline {
  agent any
  environment {
    VERSION = "2.32dev"
    INSTANCE_NAME = "${VERSION}_smoke"
    INSTANCE_URL = "https://verify.dhis2.org/${INSTANCE_NAME}/"
    GIT_URL = "https://github.com/dhis2/e2e-tests/"
    USERNAME = "$BROWSERSTACK_USERNAME"
    KEY = "$BROWSERSTACK_KEY"
    ALLURE_RESULTS_DIR = "allure-results"
    ALLURE_REPORT_DIR = "allure-report-$VERSION"
    ALLURE_REPORT_DIR_PATH = "$JENKINS_HOME/jobs/$JOB_NAME/allure"  
    AWX_BOT_CREDENTIALS = credentials('awx-bot-user-credentials')
  }

  tools {
    nodejs "node"
  }

  triggers {
    cron('H 5 * * *')
  }

  stages {
    stage ("Prepare") {
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
    
    stage('Update instance') {
      steps {
        script {
          unstash 'source'
          sh "instance_name=$INSTANCE_NAME awx_credentials=$AWX_BOT_CREDENTIALS ./update-instance.sh"
        } 
      }
    }
    stage('Build') {
      steps {
        unstash 'source'
        sh "npm install"
        sh "npm run-script browserstack -- --baseUrl=\"${INSTANCE_URL}\""
        stash name: 'source'
      }
    }
  }
    
  post {
    always {
      unstash 'source'
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
      slackSend(
        color: '#ff0000',
        message: "E2E tests initialized from branch $GIT_BRANCH for version - $VERSION failed. Please visit " + env.BUILD_URL + " for more information",
        channel: '@Gintare'
      )
    }
  }
}