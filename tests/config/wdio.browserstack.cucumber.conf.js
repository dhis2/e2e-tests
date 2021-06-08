const browserstack = require('./wdio.browserstack.conf.js').config
const cucumber = require('./wdio.cucumber.conf.js')

exports.config = {
  ...browserstack,
  ...cucumber.config,
  ...{
    services: [
      ...browserstack.services
    ]
  }
}

exports.config.services.push(cucumber.jiraService)