const browserstack = require('./wdio.browserstack.conf.js').config
const cucumber = require('./wdio.cucumber.conf.js')

exports.config = {
  ...cucumber.config,
  ...browserstack,
  ...{
    capabilities: [{
      ...browserstack.capabilities
    }],
    services: [
      ...browserstack.services
    ]
  }
}

exports.config.services.push(cucumber.jiraService)
