const allureWriter = require('@shelex/cypress-allure-plugin/writer');
const initData = require('./init-data');
const reportPortal = require('./report-portal');
const logConsole = require('./record-console-errors');
const _ = require('lodash')

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
// eslint-disable-next-line no-unused-vars
module.exports = async (on, config) => {
  await initData.install(config);
  logConsole.install(on);
  reportPortal.install(on, config);
  allureWriter(on, config);
  return config;
}


