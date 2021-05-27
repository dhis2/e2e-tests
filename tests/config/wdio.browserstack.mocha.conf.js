const browserstack = require('./wdio.browserstack.conf').config;
const mocha = require('./wdio.mocha.conf');

exports.config = {
  ...browserstack,
  ...mocha.config,
  ...{
    services: [
      ...browserstack.services
    ]
  }
}

exports.config.services.push(mocha.jiraService)
