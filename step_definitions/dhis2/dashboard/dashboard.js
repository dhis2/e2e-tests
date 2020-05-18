import { dashboardPage } from '@page_objects/Dashboard';
import { isVisible } from '@support/check';
import { getConsoleLog, getFilteredConsoleLog, saveScreenshot } from '@support/action';
import { waitForElementToExist, waitForWindowToLoad } from '@support/wait';
import { Then } from 'cucumber';
import { reportStep } from '@support/reporting'

Then(
  /^I expect that header is visible$/,
  () => {
    waitForElementToExist(dashboardPage.headerDiv);
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
  /^every dashboard item should open without errors$/, { timeout: 1000 * 1000 },
  () => {
    let totalConsoleLogs = 0;
    const filters = dashboardPage.filters;

    expect(filters.length).to.be.above(0, 'No filters to verify');

    filters.forEach(filter => {
      getFilteredConsoleLog(); // clear browser log before test

      // getText() returns empty string for invisible filters.
      const filterName = filter.$('span').getHTML(false);
      const filterHref = filter.getAttribute('href');

      console.log('opening ' + filterName);

      browser.url(filterHref);
      waitForWindowToLoad();

      const consoleLogs = getFilteredConsoleLog();
      const reportLog = 'Filter: ' + filterName + ' has ' + consoleLogs.length + ' severe errors: \n' + JSON.stringify(consoleLogs, null, 1);
      totalConsoleLogs += consoleLogs.length;

      const status = consoleLogs.length > 0 ? 'failed' : 'passed';

      // due to the test being dynamic, these has to be done here instead of using hooks. 
      reportStep(`I open ${filterName}`, 'There should be no console errors', status, reportLog)
    });

    expect(totalConsoleLogs).to.equal(0, 'Total errors: ' + totalConsoleLogs);
  }
);
