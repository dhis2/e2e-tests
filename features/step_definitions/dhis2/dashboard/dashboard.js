import { dashboardPage } from '../../../../page_objects/Dashboard';
import isVisible from '../../../support/check/isVisible';
import getConsoleLog from '../../../support/action/getConsoleLog';
import waitForPageToLoad from '../../../support/wait/waitForPageToLoad';
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
  /^every dashboard item should open without errors$/, { timeout: 500 * 1000 },
  () => {
    let totalConsoleLogs = 0;
    browser.waitForVisible(dashboardPage.filtersArea.selector);
    const filters = dashboardPage.filters;

    expect(filters.length).to.be.above(0, 'No filters to verify');

    getConsoleLog(); //clear browser log before test
    filters.forEach(filter => {
      // getText() returns empty string for invisible filters.
      const filterName = filter.element('span').getHTML(false);
      const filterHref = filter.getAttribute('href');

      console.log('opening ' + filterName);

      browser.url(filterHref);
      browser.pause(5000);

      const consoleLogs = getConsoleLog();
      const reportLog = 'Filter: ' + filterName + ' has ' + consoleLogs.length + ' severe errors: \n' + JSON.stringify(consoleLogs, null, 1);
      totalConsoleLogs += consoleLogs.length;

      const status = consoleLogs.length > 0 ? 'failed' : 'passed';
      allure.createStep(filterName, reportLog, 'attachment', status);
    });

    expect(totalConsoleLogs).to.equal(0, 'Total errors: ' + totalConsoleLogs);
  }
);
