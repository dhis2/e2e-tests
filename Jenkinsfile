pipeline {
  agent any
  environment {
    VERSION = "dev"
    GIT_URL = "https://github.com/dhis2/e2e-tests/"
    USERNAME = "$BROWSERSTACK_USERNAME"
    KEY = "$BROWSERSTACK_KEY"
    ALLURE_RESULTS_DIR = "allure-results"
    ALLURE_REPORT_DIR = "allure-report"
    ALLURE_REPORT_DIR_PATH = "$JENKINS_HOME/jobs/$JOB_NAME/allure"
  }
  tools {
    nodejs "node"
  }
  stages {
    stage ("Prepare") {
      steps {
        script {
          // if build is initialized by upstream project - get version from upstream project
          def upstreamProject = "${currentBuild.buildCauses.upstreamProject[0]}"
          if (upstreamProject != 'null') {
              VERSION = upstreamProject.substring(upstreamProject.lastIndexOf("-") + 1, upstreamProject.length())
          }

          ALLURE_REPORT_DIR += "-$VERSION"
          echo "${VERSION}"
          currentBuild.description = "${VERSION}"
          
          // prepare workspace for allure reports
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
    stage('Checkout') {
      steps {
        script {      
          git url: "${GIT_URL}"
          stash name: 'source'
        }
      }
    }
    stage('Build') {
      steps {
        unstash 'source'
        sh "npm install"
        sh "npm run-script browserstack -- --baseUrl=\"https://verify.dhis2.org/$VERSION/_smoke\""
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
        message: "E2E tests failed for version - $VERSION . Please visit " + env.BUILD_URL + " for more information",
        channel: '@Gintare'
      )
    }
  }
}