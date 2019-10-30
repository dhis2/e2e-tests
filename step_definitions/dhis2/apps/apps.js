import { getConsoleLog, saveScreenshot } from '@support/action';
import { waitForVisible, waitForPageToLoad } from '@support/wait';
import { Given, Then } from 'cucumber';

const listOfApps = [];
Given(/^I have a list of installed core apps$/, () => {
  browser.url('dhis-web-apps');
  waitForVisible(browser.$('ul'));

  const elements = browser.$$('a');
  elements.map(element => {
    if (element.getText() === 'log out' || element.getText() === 'dhis-web-core-resource') return;
    listOfApps.push(element.getText());
  });

  expect(listOfApps.length).to.be.above(0, 'No apps to open');
});

Then(/^every app should open without errors$/, { timeout: 500 * 1000 }, () => {
  let totalConsoleLogs = 0;
  let lastOpenedApp = "undefined-app";
  listOfApps.forEach(app => {
    getConsoleLog(); // clear error log  before test
    console.log('opening app: ' + app);

    browser.url(app);
    browser.pause(15000);

    const consoleLogs = filteredConsolelog(lastOpenedApp);

    const reportLog = 'App: ' + app + ' has ' + consoleLogs.length + ' severe errors: \n' + JSON.stringify(consoleLogs, null, 1);
    totalConsoleLogs += consoleLogs.length;

    const status = consoleLogs.length > 0 ? 'failed' : 'passed';
    allure.addStep(app, {content: reportLog, name: 'Console errors'}, status);
    if (status === 'failed') {
      saveScreenshot();
    }
    lastOpenedApp = app;
  });

  expect(totalConsoleLogs).to.equal(0, 'Total errors: ' + totalConsoleLogs);
});

const filteredConsolelog = (lastOpenedApp) => {
  return getConsoleLog().filter((value) => {
    const message = value['message'];
    console.log(message);
    // excluding possible errors that is not considered as errors, but rather as backend functionality
    return !(message.includes('status of 404') &&
      (message.includes('userDataStore/') ||
      message.includes('userSettings.json?'))) && 
      !message.includes(lastOpenedApp) && 
      !message.includes("manifest.json");
  });
};
