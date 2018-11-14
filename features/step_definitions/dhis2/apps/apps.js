import getConsoleLog from '../../../support/action/getConsoleLog';
import waitForVisible from '../../../support/wait/waitForVisible';
const { Given, Then } = require('cucumber');

const listOfApps = [];
Given(/^I have a list of installed core apps$/, () => {
  browser.url('dhis-web-apps');
  waitForVisible('ul');

  const elements = browser.elements('a');
  elements.value.map(element => {
    if (element.getText() === 'log out') return;
    listOfApps.push(element.getText());
  });

  expect(listOfApps.length).to.be.above(0, 'No apps to open');
});

Then(/^every app should open without errors$/, { timeout: 120 * 1000 }, () => {
  const testLogs = [];
  listOfApps.forEach(app => {
    console.log('opening app: ' + app);
    browser.url(app);
    browser.pause(1500);
    const logs = getConsoleLog();

    const log = 'App: ' + app + ' has ' + logs.length + ' severe errors: \n' + JSON.stringify(logs, null, 1);
    testLogs.push(log);
    const status = logs.length > 0 ? 'failed' : 'passed';
    allure.createStep(app, log, 'attachment', status);
  });

  expect(testLogs.length).to.equal(0, 'Total errors: ' + testLogs.length);
});
