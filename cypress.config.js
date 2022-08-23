const { defineConfig } = require('cypress')

module.exports = defineConfig({
  requestTimeout: 20000,
  defaultCommandTimeout: 20000,
  chromeWebSecurity: false,
  video: false,
  projectId: 'dhis2-e2e',
  env: {
    LOGIN_USERNAME: 'admin',
    LOGIN_PASSWORD: 'district',
    allure: 'true'
  },
  numTestsKeptInMemory: 0,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'https://smoke.dhis2.org/dev_smoke',
    specPattern: './cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    experimentalSessionAndOrigin: true,
  },
})
