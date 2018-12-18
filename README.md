# DHIS2 end to end testing

Repository for DHIS2 E2E testing.

## Technology stack

* [Webdriver.io](http://webdriver.io/): testing utility working with Selenium or other standalone WebDriver drivers
* [Chromedriver](https://sites.google.com/a/chromium.org/chromedriver/): Webdriver driver for Chrome browser
* [Cucumber](https://cucumber.io/): BDD test automation framework
* [Chai](https://chaijs.com/): BDD/TDD assertion library

## Local execution

Install the NPM dependencies:
```sh
$ npm i
```

Run the tests:
```sh
$ npm test
$ npm test -- --baseUrl=play.dhis2.org/dev/
```

## Browserstack execution
```sh
$ npm run-script browserstack
```