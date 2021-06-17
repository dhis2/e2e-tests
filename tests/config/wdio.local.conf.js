const { config } = require('./wdio.shared.conf')

exports.config = {
    ...config,
    ...{
      services: ['selenium-standalone'],
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
    }
}