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
