const { config } = require('./wdio.local.conf')
const jira = require('../../services/wdio-jira-integration-service').default;

exports.jiraService = [jira, {
  isEnabled: process.env.JIRA_ENABLED || true,
  instanceUrl: "https://jira.dhis2.org",
  username: process.env.JIRA_USERNAME,
  password: process.env.JIRA_PASSWORD,
  projectId: "10000",
  testCycle: "automated-tests",
  versionName: process.env.JIRA_RELEASE_VERSION_NAME
}]

exports.config = {
  ...config,
  ...{
    services: [
      ...config.services,
      exports.jiraService
    ],
    framework: 'cucumber',
    specs: [
      './tests/features/**/*.feature'
    ],

    cucumberOpts: {
      require: [
        './tests/step_definitions/**/**/*.js'
      ],
      backtrace: true,   // <boolean> show full backtrace for errors
      requireModule: [],  // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
      dryRun: false,      // <boolean> invoke formatters without executing steps
      failFast: false,    // <boolean> abort the run on first failure
      format: ['pretty'], // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
      colors: true,       // <boolean> disable colors in formatter output
      snippets: true,     // <boolean> hide step definition snippets for pending steps
      source: true,       // <boolean> hide source uris
      profile: [],        // <string[]> (name) specify the profile to use
      strict: false,      // <boolean> fail if there are any undefined or pending steps
      tagExpression: '',  // <string> (expression) only execute the features or scenarios with tags matching the expression
      timeout: 60000,     // <number> timeout for step definitions
      ignoreUndefinedDefinitions: false, // <boolean> Enable this config to treat undefined definitions as warnings.
      failAmbiguousDefinitions: true
    },

    afterStep: function (test, context, { error, result, duration, passed, retries }) {
      if (error) {
        browser.takeScreenshot();
      }
    },
    suites: {
      login: [
        './tests/features/loginPage.feature'
      ]
    }
  }
}
