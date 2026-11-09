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
| RUN_ALL                | read by `scripts/initDataScript.js`: open every object instead of the minimal set (see below) | false    |                           |

## Minimal vs full run

The analytics specs open objects that are discovered on the instance by `scripts/initDataScript.js`, and each test asserts that opening it logs no severe console errors. What a test exercises depends on the kind of object (chart type, layer type, item types on a dashboard), not on the particular object, so opening 284 visualizations mostly repeats the same code paths.

By default `initDataScript.js` therefore writes only a **minimal set** to `cypress.env.json`. Setting `RUN_ALL=true` writes **all** objects:

```sh
RUN_ALL=true node ./scripts/initDataScript.js   # full
node ./scripts/initDataScript.js                # minimal (default)
```

In Jenkins, scheduled runs use the minimal set, except on Wednesdays, when they open everything. (If the Wednesday run is skipped because there is no new DHIS2 build, there is no full run that week.) Run a full one at any time by building with the `run_all` parameter. The build description says which one it was.

### What the minimal set is

One object per distinct combination of the properties below, taken in name order. It is computed on every run, so new kinds of objects on the instance are picked up automatically and nothing needs maintaining by hand.

| Spec / app | Objects (play 2.44) | What one object per group covers |
| --- | --- | --- |
| Data visualizer | 45 of 284 | Chart type (pivot table, column, line, pie, gauge, ...), legend set, kind of data items (indicator, data element, program indicator, reporting rate, ...), program-based or not |
| Maps | 22 of 91 | Combination of layer types (thematic, event, facility, boundary, Earth Engine, external) and the basemap, as each basemap is a different tile provider |
| Event reports | 3 of 31 | Aggregated vs event table, tracker vs event program |
| Event visualizer | 7 of 19 | Chart type, tracker vs event program |
| Line listing | 2 of 7 | Event vs enrollment output, tracker vs event program |
| Dashboards | 9 of 22 | The dashboard app, plus every kind of item rendered in plugin mode: each chart type, each map layer type, event charts/reports, TEXT, MESSAGES, RESOURCES, REPORTS, USERS, APP. Picked as the fewest dashboards that together contain every kind (smaller ones win ties) |
| Apps smoke | 34 of 41 | Every installed app is its own bundle and keeps its test, except the ones in `scripts/excludes.json`, which already get opened by their own spec (dashboard, data visualizer, event reports, event visualizer, line listing, maps, capture) |
| Capture, Android settings | all | Not affected: hand-written flows with their own assertions |

Reasons why this is enough:

- A visualization, map or event object is rendered by the same code whichever object it is, so a failure caused by a chart type, layer type or data-item kind shows up in the representative of its group. Objects in the same group only differ in data and titles.
- A dashboard test opens many objects at once in plugin mode, a different code path from the app that opens them, and it is the only test of the non-chart items (text, messages, resources, reports, users, apps).

What is lost: a bug caused by one object's specific configuration (for example one unusual dimension or a particular legend) is not found by the minimal set. The weekly full run is there to catch these.

To skip an app, add its `webName` from `/dhis-web-apps/apps-bundle.json` and the reason to `scripts/excludes.json`.

## Reporting

### Allure

[Allure](https://docs.qameta.io/allure/) is the framework used to generate a test report. To generate and serve the report, run `yarn run allure:serve`. The report should open in a browser window.
