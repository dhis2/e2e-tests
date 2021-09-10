exports.config = {
  ...{
    user: process.env.USERNAME,
    key: process.env.KEY,
    capabilities: {
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
        'browserVersion': 'latest',
        'local': 'false',
        'networkLogs': 'true',
        'seleniumVersion': '3.14.0',
        'resolution': '2048x1536'
      },
      acceptInsecureCerts: true,
      'goog:chromeOptions': {
        'args': [
          '--allow-running-insecure-content',
          '--disable-web-security',
          '--ignore-certificate-error'
        ]
      }
    },
    services: [
      'browserstack'
    ],
    waitforTimeout: 30000
  }
}

