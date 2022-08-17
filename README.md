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

2. Install the NPM dependencies:
    ```sh
    $ npm i
    ```
    Note that for older branches the dependencies may fail and you may have to run it with `--legacy-peer-deps` flag:
    ```sh
    $ npm i --legacy-peer-deps
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
    $ npm cy:test
    ```
    
    or in parallel (using 3 threads):
    ```sh
    $ npm cy:parallel 
    ```
## Environment variables

| Environment variable | Description | Required | Default value | 
|---|---|---|---|
| CYPRESS_BASE_URL | URL of instance under test | true | smoke.dhis2.org/dev_smoke | 
| CYPRESS_LOGIN_USERNAME  | username of user used in tests   |  true | admin |
| CYPRESS_LOGIN_PASSWORD | password of user used in tests | true | district | 
| CYPRESS_REPORT_PORTAL_ENABLED | boolean parameter used to control integration with report portal | false | false | 
| RP_TOKEN | token of the report portal user. Only used if running cy:parallel-report | false | N/A |
| CI_BUILD_ID | used as an attribute in RP launches to be able to merge the launches after all tests | false | |
| JIRA_ENABLED | boolean parameter used to control integration with jira reporter | false | N/A | 
| JIRA_USERNAME | username of the jira user | if JIRA_ENABLED | N/A |
| JIRA_PASSWORD | password of the jira user | if JIRA_ENABLED | N/A |
| JIRA_RELEASE_VERSION_NAME| version of the release cycle in zephyr | if JIRA_ENABLED | N/A |


## Reporting
### Allure
[Allure](https://docs.qameta.io/allure/)  is the framework used to generate a test report. To generate and serve the report, run `npm run allure:serve`. The report should open in a browser window. 

### Report portal

To enable syncing with report portal, the following environment variables are required:

| Environment variable | Description |
|--|--|
| RP_TOKEN | Token of report portal user. Can be found in [user profile of report portal](https://test.tools.dhis2.org/reportportal/ui/#user-profile) |
| CI_BUILD_ID | An attribute to add to every launch started by report portal used to merge the launches after test run. | 

### JIRA
The following environment variables are required to sync with jira: 

| Environment variable | Description |
|--|--|
| JIRA_ENABLED | boolean parameter used to control integration with jira reporter | 
| JIRA_USERNAME | username of the jira user |
| JIRA_PASSWORD | password of the jira user |
| JIRA_RELEASE_VERSION_NAME| version of the release cycle in zephyr |