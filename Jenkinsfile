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
    AWX_BOT_CREDENTIALS = credentials('awx-bot-user-credentials')
  }

  tools {
    nodejs "node"
  }

  triggers {
    cron('H 5 * * *')
  }

  stages {
        
    stage('Update instance') {
      steps {
        script {
          sh "instance_name=$INSTANCE_NAME awx_credentials=$AWX_BOT_CREDENTIALS ./update-instance.sh"
        } 
      }
    }
    stage('Build') {
      steps {
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
          report: "./$ALLURE_REPORT_DIR"
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