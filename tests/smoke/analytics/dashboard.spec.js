import { login, getConsoleLog, getFilteredConsoleLog } from '#support/action';
import { dashboardPage } from '#page_objects/Dashboard';
import { waitForWindowToLoad } from '#support/wait';

describe('Smoke', function() {
  describe('Dashboards app -> DHIS2-8010', function() {
    before(() => {
      allure.addFeature("Smoke");

      login(browser.config.superUser, browser.config.superUserPassword);
  
      const filters = dashboardPage.filters;
  
      filters.forEach((filter) => {
          // getText() returns empty string for invisible filters.
          const filterName = filter.$('span span').getHTML(false);
          const filterHref = filter.getAttribute('href');
          const newTest = it('I open ' + filterName, function() {
            allure.addFeature("Smoke");
            getConsoleLog(); // clear browser log before test
            console.log('opening ' + filterName);
            console.log(filter)
            browser.url(filterHref);
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
    
    it('1. I open dashboard app', function() {
      //this.skip();
      dashboardPage.open();
  
      expect(dashboardPage.filters.length).to.be.above(0);
    })
  
  })
})
