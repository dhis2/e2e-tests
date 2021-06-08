const chai = require('chai');
require('@babel/register');
const drivers = {
  chrome: { version: '90.0.4430.24' }, // https://chromedriver.chromium.org/
}
exports.config = {
  superUser: process.env.SUPER_USER || 'system',
  superUserPassword: process.env.SUPER_USER_PASSWORD || 'System123', 
  runner: 'local',
  maxInstances: process.env.DEBUG === '1' ? 1 : 10,
  capabilities: [{
    // maxInstances can get overwritten per capability. So if you have an in-house Selenium
    // grid with only 5 firefox instances available you can make sure that not more than
    // 5 instances get started at a time.
    maxInstances: process.env.DEBUG === '1' ? 1 : 3,
    //
    browserName: 'chrome',
    'goog:chromeOptions': {
      'args': [
        '--allow-running-insecure-content',
        '--disable-web-security'
      ]
    }
  }],

  screenshotPath: './errorShots/',
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: 'error',
  coloredLogs: true,
  bail: 0,
  //
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  baseUrl: process.env.BASE_URL || 'https://smoke.dhis2.org/dev_smoke/',
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
  //
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  
  services: [
    ['selenium-standalone', {
      logPath: 'logs',
      installArgs: { drivers },
      args: { drivers },
    }]
  ],

  seleniumLogs: './logs',

  reporters: [
    'spec',
    ['allure', {
      outputDir: './reports/allure-results',
      disableWebdriverStepsReporting: true,
      useCucumberStepReporter: true,
      disableWebdriverScreenshotsReporting: false
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
    global.allure = require('@wdio/allure-reporter').default
  }
};
