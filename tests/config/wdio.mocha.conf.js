const { config } = require('./wdio.local.conf')
const jira = require('../../services/wdio-jira-integration-service-mocha').default;
const chai = require('chai');

exports.jiraService = [ jira, {
  isEnabled: process.env.JIRA_ENABLED || true,
  instanceUrl: "https://jira.dhis2.org",
  username: process.env.JIRA_USERNAME,
  password: process.env.JIRA_PASSWORD,
  projectId: "10000",
  testCycle: "automated-tests",
  versionName: process.env.JIRA_RELEASE_VERSION_NAME  
}];

exports.config = {
  ...config,
  ...{
    runner: 'local',
    //
    // Override default path ('/wd/hub') for chromedriver service.
    specs: [
      './tests/smoke/**/*.spec.js'
    ],
    framework: 'mocha',
    mochaOpts: {
      timeout: 60000 ,
      ui: 'bdd' ,
      compilers: ['js:@babel/register'] 
    },
    services: [
      ...config.services,
      exports.jiraService
    ],
    reporters: [
      'spec',
      ['allure', {
        outputDir: './reports/allure-results',
        disableMochaHooks: false
      }]
    ],
  
    before: function (capabilities, specs) {
      /**
       * Setup the Chai assertion framework
       */
      global.__basedir = __dirname;
      global.expect = chai.expect;
      global.assert = chai.assert;
      global.should = chai.should();
      chai.Should();
      global.allure = require('@wdio/allure-reporter').default
    },
    afterTest(details,context, { error, result, duration, passed }) {
      if (error) {
        browser.takeScreenshot();
      }
    },
    suites: {
      smoke: [
        './tests/specs/analytics/dashboard.spec.js',
        './tests/specs/analytics/eventReports.spec.js',
        './tests/specs/analytics/eventVisualiser.spec.js',
        './tests/specs/analytics/maps.spec.js',
        './tests/specs/analytics/pivotTables.spec.js',
        './tests/specs/apps.spec.js'
      ]
    }
    } 
  }
