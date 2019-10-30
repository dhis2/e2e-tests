import { dashboardPage } from '@page_objects/Dashboard';
import { isVisible}  from '@support/check';
import { getConsoleLog, saveScreenshot }  from '@support/action';
import { waitForElementToExist } from '@support/wait';
import { Then } from 'cucumber';

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
  /^every dashboard item should open without errors$/, { timeout: 500 * 1000 },
  () => {
    let totalConsoleLogs = 0;
    const filters = dashboardPage.filters;

    expect(filters.length).to.be.above(0, 'No filters to verify');

    filters.forEach(filter => {
      getConsoleLog(); // clear browser log before test

      // getText() returns empty string for invisible filters.
      const filterName = filter.$('span').getHTML(false);
      const filterHref = filter.getAttribute('href');

      console.log('opening ' + filterName);

      browser.url(filterHref);
      browser.pause(10000);

      const consoleLogs = getConsoleLog();
      const reportLog = 'Filter: ' + filterName + ' has ' + consoleLogs.length + ' severe errors: \n' + JSON.stringify(consoleLogs, null, 1);
      totalConsoleLogs += consoleLogs.length;

      const status = consoleLogs.length > 0 ? 'failed' : 'passed';
      allure.addStep(filterName, {content: reportLog, name: 'Console errors'}, status);
      if (status === 'failed') {
        saveScreenshot();
      }
    });

    expect(totalConsoleLogs).to.equal(0, 'Total errors: ' + totalConsoleLogs);
  }
);
