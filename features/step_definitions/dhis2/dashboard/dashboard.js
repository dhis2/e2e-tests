import { dashboardPage } from '../../../../page_objects/Dashboard';
import isVisible from '../../../support/check/isVisible';
import getConsoleLog from '../../../support/action/getConsoleLog';
const { Then } = require('cucumber');

Then(
  /^I expect that header is visible$/,
  () => {
    browser.waitForExist(dashboardPage.headerDiv.selector);
    isVisible(dashboardPage.headerDiv);
  }
);
Then(
  /^I expect the logout link to be present$/,
  () => {
    isVisible(dashboardPage.logoutLink);
  }
);

Then(
  /^I expect that dashboard filters are visible$/,
  () => {
    isVisible(dashboardPage.filtersArea, false);
  }
);

Then(
  /^every dashboard item should open without errors$/, { timeout: 120 * 1000 },
  () => {
    const testLogs = [];
    const filters = dashboardPage.filters;

    expect(filters.length).to.be.above(0, 'No filters to verify');

    filters.forEach(filter => {
      const filterName = filter.getText();
      const filterHref = filter.getAttribute('href');
      console.log('opening ' + filterName);
      browser.url(filterHref);
      browser.pause(1500);
      const logs = getConsoleLog();

      const log = 'Filter: ' + filterName + ' has ' + logs.length + ' severe errors: \n' + JSON.stringify(logs, null, 1);
      testLogs.push(log);
      const status = logs.length > 0 ? 'failed' : 'passed';
      allure.createStep(filterName, log, 'attachment', status);
    });

    expect(testLogs.length).to.equal(0, 'Total errors: ' + testLogs.length);
  }
);
