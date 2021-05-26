import { login, getConsoleLog, getFilteredConsoleLog } from '#support/action';
import { dashboardPage } from '#page_objects/Dashboard';
import { waitForWindowToLoad } from '#support/wait';

describe('Dashbords should load without console errors -> DHIS2-8010', function() {
  before(() => {
    login(browser.config.superUser, browser.config.superUserPassword);

    const filters = dashboardPage.filters;

    filters.forEach((filter) => {
        // getText() returns empty string for invisible filters.
        const filterName = filter.$('span span').getHTML(false);
        
        const newTest = it('I open ' + filterName, function() {
          getConsoleLog(); // clear browser log before test
          console.log('opening ' + filterName);
          browser.url(filter.getAttribute('href'));
          waitForWindowToLoad();

          const consoleLogs = getFilteredConsoleLog();
          const reportLog = 'Filter: ' + filterName + ' has ' + consoleLogs.length + ' severe errors: \n' + JSON.stringify(consoleLogs, null, 1);

          // due to the test being dynamic, these has to be done here instead of using hooks. 
          //reportStep(`I open ${filterName}`, 'There should be no console errors', status, reportLog)
          
          expect(consoleLogs.length, reportLog).to.equal(0);
      })

      this.tests.push(newTest)
    }) 
  }) 
  
  it('I open dashboard app', function() {
    //this.skip();
    dashboardPage.open();

    expect(dashboardPage.filters.length).to.be.above(0);
  })

})