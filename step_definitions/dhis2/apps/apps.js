import { getConsoleLog, getFilteredConsoleLog, saveScreenshot } from '#support/action';
import { waitForVisible, waitForWindowToLoad } from '#support/wait';
import { Given, Then } from 'cucumber';
import { reportStep } from '#support/reporting'

const listOfApps = ['dhis-web-dataentry/index.action', 'dhis-web-approval/index.action'];
Given(/^I have a list of installed core apps$/, () => {
  browser.url('dhis-web-apps');
  waitForVisible(browser.$('table'));

  const elements = browser.$$('a');
  
  elements.map(element => {
    if (element.getText() === 'log out' || element.getText() === 'dhis-web-core-resource' || element.getText() === 'Apps Bundle JSON') return;
    listOfApps.push(element.getText());
  });

  expect(listOfApps.length).to.be.above(0, 'No apps to open');
});

Then(/^every app should open without errors$/, { timeout: 1000 * 1000 }, () => {
  let totalConsoleLogs = 0;
  let lastOpenedApp = "undefined-app";
  listOfApps.forEach(app => {
    getConsoleLog(); // clear error log  before test
    console.log('opening app: ' + app);

    browser.url(app);
    waitForWindowToLoad();

    const consoleLogs = filteredConsolelog(lastOpenedApp);

    const reportLog = 'App: ' + app + ' has ' + consoleLogs.length + ' severe errors: \n' + JSON.stringify(consoleLogs, null, 1);
    totalConsoleLogs += consoleLogs.length;

    const status = consoleLogs.length > 0 ? 'failed' : 'passed';
    
    // due to the test being dynamic, these has to be done here instead of using hooks. 
    reportStep(`I open ${app}`, 'There should be no console errors', status , reportLog)
    lastOpenedApp = app;
  });

  expect(totalConsoleLogs).to.equal(0, 'Total errors: ' + totalConsoleLogs);
});

const filteredConsolelog = (lastOpenedApp) => {
  return getFilteredConsoleLog().filter((value) => {
    const message = value['message'];
    return !message.includes(lastOpenedApp)
  });
};
