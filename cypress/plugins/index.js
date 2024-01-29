const allureWriter = require("@shelex/cypress-allure-plugin/writer");
const reportPortal = require("./report-portal");
const logConsole = require("./record-console-errors");

/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // Install additional plugins
  logConsole.install(on);
  reportPortal.install(on, config);
  allureWriter(on, config);

  return config;
};
