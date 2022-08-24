const registerReportPortalPlugin = require('@reportportal/agent-js-cypress/lib/plugin');

const install = ( on, config) => {
  registerReportPortalPlugin(on, config);
}

module.exports = {
  install
}