const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");

module.exports = defineConfig({
  requestTimeout: 20000,
  defaultCommandTimeout: 20000,
  chromeWebSecurity: false,
  video: false,
  projectId: "dhis2-e2e",
  env: {
    LOGIN_USERNAME: "admin",
    LOGIN_PASSWORD: "district",
    allure: "true",
    grepTags: process.env.TAGS,
    allureResultsPath: "reports/allure-results",
    apps: [
      "dhis-web-aggregate-data-entry",
      "dhis-web-approval",
      "dhis-web-app-management",
      "dhis-web-cache-cleaner",
      "dhis-web-capture",
      "dhis-web-dashboard",
      "dhis-web-data-administration",
      "dhis-web-data-visualizer",
      "dhis-web-data-quality",
      "dhis-web-datastore",
      "dhis-web-event-reports",
      "dhis-web-event-visualizer",
      "dhis-web-import-export",
      "dhis-web-interpretation",
      "dhis-web-maintenance",
      "dhis-web-maps",
      "dhis-web-menu-management",
      "dhis-web-messaging",
      "dhis-web-reports",
      "dhis-web-scheduler",
      "dhis-web-sms-configuration",
      "dhis-web-settings",
      "dhis-web-tracker-capture",
      "dhis-web-translations",
      "dhis-web-usage-analytics",
      "dhis-web-user",
      "dhis-web-user-profile",
    ],
  },
  numTestsKeptInMemory: 0,
  e2e: {
    setupNodeEvents(on, config) {
      // Read dynamic environment variables
      const envPath = path.resolve("/e2e/env_files", "cypress.env.json");

      if (fs.existsSync(envPath)) {
        const dynamicEnv = JSON.parse(fs.readFileSync(envPath, "utf8"));
        config.env = { ...config.env, ...dynamicEnv };
      }

      require("cypress-grep/src/plugin")(config);
      return require("./cypress/plugins/index.js")(on, config);
    },
    baseUrl: "https://smoke.dhis2.org/dev_smoke",
    specPattern: "./cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    experimentalSessionAndOrigin: true,
  },
});
