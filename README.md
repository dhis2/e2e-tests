# DHIS2 end to end testing

Repository for DHIS2 E2E testing.

## Technology stack

* [Webdriver.io](http://webdriver.io/): testing utility working with Selenium or other standalone WebDriver drivers
* [Chromedriver](https://sites.google.com/a/chromium.org/chromedriver/): Webdriver driver for Chrome browser
* [Cucumber](https://cucumber.io/): BDD test automation framework
* [Chai](https://chaijs.com/): BDD/TDD assertion library

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
    export SUPER_USER=<dhis2_superuser>
    export SUPER_USER_PASSWORD=<dhis2_superuser_password>
    export JIRA_ENABLED=false
    export BASE_URL=<instance_URL>  # e.g. https://prep.dhis2.org/2.38dev/ 
    ```

4. Run the tests:
    ```sh
    $ npm test
    ```

    > Optional Browserstack execution
    > ```sh
    > $ npm run-script browserstack
    > ```


## Viewing the results with Allure

1. Install Allure (first time only)

    See the [Allure installation guide](https://docs.qameta.io/allure/#_installing_a_commandline)

2. By default, the results of the above test run will be placed in the `./reports/allure-results/` directory. To view these as HTML with allure simply run:
   ```sh
   $ allure serve reports/allure-results/
   ```

3. Alternatively, you may want to generate the results for later viewing. You can generate with:
   ```sh
   $ allure generate --clean reports/allure-results/ -o <output_dir_for_baseline>
   ```
   Later, you can view the results with
   ```sh
   $ allure open <output_dir_for_baseline>
   ```
