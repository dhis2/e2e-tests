@Library('pipeline-library') _
pipeline {
  agent {
    label "ec2-jdk11-node14"
  }

  options {
    disableConcurrentBuilds()
    ansiColor('xterm')
  }

  environment {
    HOME = pwd()
    VERSION = "dev"
    INSTANCE_NAME = "${VERSION}_smoke"
    INSTANCE_DOMAIN = "smoke.dhis2.org"
    INSTANCE_URL = ""
    GIT_URL = "https://github.com/dhis2/e2e-tests/"
    AWX_BOT_CREDENTIALS = credentials('awx-bot-user-credentials')
    ALLURE_REPORT_DIR_PATH = "./allure"
    ALLURE_RESULTS_DIR = "reports/allure-results"
    ALLURE_REPORT_DIR = "allure-report-$VERSION"  
    JIRA_RELEASE_VERSION_NAME = sh(script: './get_next_version.sh', returnStdout: true)
  }

  triggers {
    cron(env.BRANCH_NAME.contains('.') ? '' : 'H 6 * * *')
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
          INSTANCE_URL = "https://${INSTANCE_DOMAIN}/${INSTANCE_NAME}/"
          JIRA_RELEASE_VERSION_NAME = "$VERSION"
          echo "Version: $VERSION, JIRA_RELEASE_VERSION_NAME: $JIRA_RELEASE_VERSION_NAME"
        }
      }
    }

    stage('Update instance') {
      steps {
        script {
          INSTANCE_URL = "https://${INSTANCE_DOMAIN}/${INSTANCE_NAME}/"
          awx.resetWar("$AWX_BOT_CREDENTIALS", "${INSTANCE_DOMAIN}", "${INSTANCE_NAME}")
          sh "credentials=system:System123 url=${INSTANCE_URL} ./delete-data.sh"
          sh "credentials=system:System123 url=${INSTANCE_URL} ./install_apps.sh"
        } 
      }
    }

    stage('Prepare reports dir') {
      steps {
        script {
          if (!fileExists("$ALLURE_REPORT_DIR_PATH")) {
            sh "mkdir -p $ALLURE_REPORT_DIR_PATH"
          } 
          if (fileExists("$ALLURE_RESULTS_DIR")) {
            dir("$ALLURE_RESULTS_DIR", {
              deleteDir()
            })
          }   
    
          sh "mkdir -p ./$ALLURE_RESULTS_DIR"
              
          if (fileExists("$ALLURE_REPORT_DIR_PATH/$ALLURE_REPORT_DIR/history")) {
            sh "cp  -r $ALLURE_REPORT_DIR_PATH/$ALLURE_REPORT_DIR/history ./$ALLURE_RESULTS_DIR/history"
            sh "cp  -r $ALLURE_REPORT_DIR_PATH/$ALLURE_REPORT_DIR/data ./$ALLURE_RESULTS_DIR/data"
          } 
        } 
      }      
    }

    stage('Test') {
      environment {
        JIRA_ENABLED = true
        JIRA_USERNAME = "$JIRA_USERNAME"
        JIRA_PASSWORD = "$JIRA_PASSWORD"
        BASE_URL = "${INSTANCE_URL}"
        CI_BUILD_ID="${BUILD_NUMBER}"
        RP_TOKEN = credentials('report-portal-access-uuid')
      }

      steps {
        script {
          // assign version to the report portal version attribute
          def json = sh(returnStdout: true, script: "jq '.reportportalAgentJsCypressReporterOptions.attributes[0].value=\"${JIRA_RELEASE_VERSION_NAME}\"' reporter-config.json")
          writeFile(text: "$json", file: 'reporter-config.json')
          sh "docker-compose up --exit-code-from cypress-tests"
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
        // stop the instance after to offload smoke.dhis2
        awx.stopWar("$AWX_BOT_CREDENTIALS", "smoke.dhis2.org", "${INSTANCE_NAME}")
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
