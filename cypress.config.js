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
  },
  numTestsKeptInMemory: 0,
  e2e: {
    setupNodeEvents(on, config) {
      console.log(`Current Working Directory: ${process.cwd()}`);

      // Read dynamic environment variables
      const envPath = path.resolve(
        "/home/ubuntu/jenkins-tmp/workspace/e2e-tests_PR-318",
        "cypress.env.json"
      );
      console.log(`Resolved Path for cypress.env.json: ${envPath}`);

      if (fs.existsSync(envPath)) {
        const dynamicEnv = JSON.parse(fs.readFileSync(envPath, "utf8"));
        console.log(`Read environment variables:`, dynamicEnv);
        config.env = { ...config.env, ...dynamicEnv };
      } else {
        console.log(`cypress.env.json not found at ${envPath}`);
      }

      require("cypress-grep/src/plugin")(config);
      console.log(`Final Cypress Config:`, config);
      return require("./cypress/plugins/index.js")(on, config);
    },
    baseUrl: "https://smoke.dhis2.org/dev_smoke",
    specPattern: "./cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    experimentalSessionAndOrigin: true,
  },
});
