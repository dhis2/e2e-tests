const merge = require('deepmerge');
const wdioConf = require('./wdio.conf.js')

exports.config = merge(wdioConf.config, {
  runner: 'local',
  user: process.env.USERNAME,
  key: process.env.KEY,
  capabilities: [{
    // maxInstances can get overwritten per capability. So if you have an in-house Selenium
    // grid with only 5 firefox instances available you can make sure that not more than
    // 5 instances get started at a time.
    maxInstances: process.env.DEBUG === '1' ? 1 : 3,
    platformName: 'WINDOWS',
    //
    browserName: 'chrome',
    'bstack:options': {
      'os': 'Windows',
      'osVersion': '10',
      'local': 'false',
      'seleniumVersion': '3.14.0'           
    },
    'goog:chromeOptions': {
       'args': [
        '--allow-running-insecure-content',
        '--disable-web-security'
      ]
    }
  }],
  waitforTimeout: 30000
})

exports.config.services.push('browserstack')
exports.config = _.defaultsDeep(overrides, defaults);
