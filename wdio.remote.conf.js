exports.config = {
  user: process.env.USERNAME,
  key: process.env.KEY,
  
  specs: [
      './features/**/*.feature'
  ],
  // Patterns to exclude.
  exclude: [
      // 'path/to/excluded/files'
  ],

  maxInstances: 10,
  
  capabilities: [{
      // maxInstances can get overwritten per capability. So if you have an in-house Selenium
      // grid with only 5 firefox instances available you can make sure that not more than
      // 5 instances get started at a time.
      maxInstances: 3,
      //
      browserName: 'chrome'
  }],

  seleniumLogs: './logs',
  seleniumInstallArgs: { version: '3.4.0' },
  seleniumArgs: { version: '3.4.0' },
 
  sync: true,
  //
  // Level of logging verbosity: silent | verbose | command | data | result | error
  logLevel: 'error',
  //
  // Enables colors for log output.
  coloredLogs: true,
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  //
  // Saves a screenshot to a given path if a command fails.
  screenshotPath: './errorShots/',
  //
  // Set a base URL in order to shorten url command calls. If your url parameter starts
  // with "/", then the base url gets prepended.
  baseUrl: "https://play.dhis2.org/2.31-rc1/",
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: 10000,
  //
  // Default timeout in milliseconds for request
  // if Selenium Grid doesn't send response
  connectionRetryTimeout: 90000,
  //
  // Default request retries count
  connectionRetryCount: 3,
 
  services: ['browserstack'],

  framework: 'cucumber',

  reporters: [
      'spec', 'allure',
  ],

  reporterOptions: {
      allure: {
          outputDir: './reports/',
          disableWebdriverStepsReporting: true,
          useCucumberStepReporter: true
      }
  },
  //
  // If you are using Cucumber you need to specify the location of your step definitions.
  cucumberOpts: {
      // <string[]> (file/dir) require files before executing features
      require: [
          './features/step_definitions/**/*.js',
          './features/step_definitions/given.js',
          './features/step_definitions/when.js',
          './features/step_definitions/then.js',
          './features/step_definitions/dhis2/given.js',
          './features/step_definitions/dhis2/when.js',
          './features/step_definitions/dhis2/then.js'
      ],
      backtrace: true,   // <boolean> show full backtrace for errors
      // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
      compiler: [
          'js:babel-register'
      ],
      dryRun: false,      // <boolean> invoke formatters without executing steps
      failFast: false,    // <boolean> abort the run on first failure
      format: ['pretty'], // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
      colors: true,       // <boolean> disable colors in formatter output
      snippets: true,     // <boolean> hide step definition snippets for pending steps
      source: true,       // <boolean> hide source uris
      profile: [],        // <string[]> (name) specify the profile to use
      strict: true ,      // <boolean> fail if there are any undefined or pending steps
      tags: [],           // <string[]> (expression) only execute the features or scenarios with tags matching the expression
      timeout: 20000,     // <number> timeout for step definitions
      ignoreUndefinedDefinitions: false, // <boolean> Enable this config to treat undefined definitions as warnings.
  },

  //
  // =====
  // Hooks
  // =====
  // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
  // it and to build services around it. You can either apply a single function or an array of
  // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
  // resolved to continue.
  /**
   * Gets executed once before all workers get launched.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   */
  // onPrepare: function (config, capabilities) {
  // },
  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or spec.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  // beforeSession: function (config, capabilities, specs) {
  // },
  /**
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like `browser`. It is the perfect place to define custom commands.
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  before: function (capabilities, specs) {
      /**
       * Setup the Chai assertion framework
       */
      const chai = require('chai');

      global.expect = chai.expect;
      global.assert = chai.assert;
      global.should = chai.should();
  },
  //
  /**
   * Hook that gets executed before the suite starts
   * @param {Object} suite suite details
   */
  // beforeSuite: function (suite) {
  // },
  /**
   * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
   * beforeEach in Mocha)
   */
  // beforeHook: function () {
  // },
  /**
   * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
   * afterEach in Mocha)
   */
  // afterHook: function () {
  // },
  /**
   * Function to be executed before a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
   * @param {Object} test test details
   */
  // beforeTest: function (test) {
  // },
  /**
   * Runs before a WebdriverIO command gets executed.
   * @param {String} commandName hook command name
   * @param {Array} args arguments that command would receive
   */
  // beforeCommand: function (commandName, args) {
  // },
  /**
   * Runs after a WebdriverIO command gets executed
   * @param {String} commandName hook command name
   * @param {Array} args arguments that command would receive
   * @param {Number} result 0 - command success, 1 - command error
   * @param {Object} error error object if any
   */
  // afterCommand: function (commandName, args, result, error) {
  // },
  /**
   * Function to be executed after a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
   * @param {Object} test test details
   */
  // afterTest: function (test) {
  // },
  /**
   * Hook that gets executed after the suite has ended
   * @param {Object} suite suite details
   */
  // afterSuite: function (suite) {
  // },
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {Number} result 0 - test pass, 1 - test fail
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // after: function (result, capabilities, specs) {
  // },
  /**
   * Gets executed right after terminating the webdriver session.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // afterSession: function (config, capabilities, specs) {
  // },
  /**
   * Gets executed after all workers got shut down and the process is about to exit. It is not
   * possible to defer the end of the process using a promise.
   * @param {Object} exitCode 0 - success, 1 - fail
   */
  // onComplete: function(exitCode) {
  // }
  //
  // ======
  // Suites
  // ======
  suites: {
      login: [
          './features/loginPage.feature'
      ]
  }
   
}