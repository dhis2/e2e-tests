## Technology stack

- [Cypress] (https://www.cypress.io/)
- [Allure] (https://docs.qameta.io/): reporting framework

## Local execution

1. Check out the relevant branch:
   E.g. if you are testing a 2.32.x version of DHIS2

   ```sh
   $ git checkout v32
   ```

   or, if you are testing a 2.38.x version of DHIS2

   ```sh
   $ git checkout v38
   ```

2. Install dependencies:

   ```sh
   $ yarn install
   ```

3. Set the environment

   ```sh
   export CYPRESS_LOGIN_USERNAME=<dhis2_superuser>
   export CYPRESS_LOGIN_PASSWORD=<dhis2_superuser_password>
   export CYPRESS_BASE_URL=<instance_URL>  # e.g. https://prep.dhis2.org/2.38dev/
   ...

   see [Environment variables section](#environment-variables) for more configuration options
   ```

4. Adapt the tests to your environment:
   Some of the test feature files include references from the Sierra Leone demo DB. These should be replaced to suit your target DB  
   Check the following feature files and update the parameters in double-quotes (`"`) accordingly:
   ```sh
   ./cypress/e2e/capture.cy.js
   ```
5. Run the tests:

   ```sh
   $ yarn run cy:test
   ```

   or in parallel (using 3 threads):

   ```sh
   $ yarn run cy:parallel
   ```

   or only smoke tests:

   ```sh
   $ export TAGS=smoke
   $ yarn run cy:test (or any other command)
   ```

## Environment variables

| Environment variable   | Description                          | Required | Default value             |
| ---------------------- | ------------------------------------ | -------- | ------------------------- |
| CYPRESS_BASE_URL       | URL of instance under test           | true     | smoke.dhis2.org/dev_smoke |
| CYPRESS_LOGIN_USERNAME | username of user used in tests       | true     | admin                     |
| CYPRESS_LOGIN_PASSWORD | password of user used in tests       | true     | district                  |
| TAGS                   | filter tests matching specified tags | false    |                           |

## Reporting

### Allure

[Allure](https://docs.qameta.io/allure/) is the framework used to generate a test report. To generate and serve the report, run `yarn run allure:serve`. The report should open in a browser window.


## Notes about specific tests

### Smoke app tests

It checks the apps load correctly. It gets the list of the apps on _jenkins_ using a script `initDataScript` which sets some environment variables for the tests.

To get the list of the apps, a call is made to `/dhis-web-apps/apps-bundle.json` then the webname field is used for running the tests.

To run the tests locally, you can temporarily add this list to `cypress.config.js`. This is how the list would like look like:


```
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
```