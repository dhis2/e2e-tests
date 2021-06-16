import { login, getConsoleLog, getFilteredConsoleLog } from '#support/action';
import { dashboardPage } from '#page_objects/Dashboard';
import { waitForWindowToLoad } from '#support/wait';

describe('Dashboards app -> DHIS2-8010', function() {
  before(() => {
    login(browser.config.superUser, browser.config.superUserPassword);

    const filters = dashboardPage.filters;

    filters.forEach((filter) => {
        // getText() returns empty string for invisible filters.
        const filterName = filter.$('span span').getHTML(false);
        const filterHref = filter.getAttribute('href');
        const newTest = it('I open ' + filterName, function() {
          getConsoleLog(); // clear browser log before test
          console.log('opening ' + filterName);
          browser.url(filterHref);
          waitForWindowToLoad();

          const consoleLogs = getFilteredConsoleLog();
          const reportLog = 'Filter: ' + filterName + ' has ' + consoleLogs.length + ' severe errors: \n' + JSON.stringify(consoleLogs, null, 1);

          expect(consoleLogs.length, reportLog).to.equal(0);
      })

      this.tests.push(newTest)
    }) 
  }) 
  
  it('1. I open dashboard app', function() {
    dashboardPage.open();

    expect(dashboardPage.filters.length).to.be.above(0);
  })

})
