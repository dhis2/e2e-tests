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
      // Read dynamic environment variables
      const envPath = path.resolve("/e2e/env_files", "cypress.env.json");

      if (fs.existsSync(envPath)) {
        const dynamicEnv = JSON.parse(fs.readFileSync(envPath, "utf8"));
        config.env = { ...config.env, ...dynamicEnv };
      }

      require("cypress-grep/src/plugin")(config);

      // Modify browser launch options to disable GPU
      on("before:browser:launch", (browser = {}, launchOptions) => {
        if (browser.family === "chromium" && browser.name !== "electron") {
          launchOptions.args.push("--disable-gpu"); // Disable GPU
        }
        return launchOptions;
      });

      return require("./cypress/plugins/index.js")(on, config);
    },
    baseUrl: "https://smoke.dhis2.org/dev_smoke",
    specPattern: "./cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    experimentalSessionAndOrigin: true,
  },
});
