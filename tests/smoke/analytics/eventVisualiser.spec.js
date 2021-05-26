import { login, getConsoleLog, getFilteredConsoleLog } from '#support/action'
import { eventVisualiser } from '#page_objects/analytics/eventVisualiser';

describe('Smoke', () => {
  describe('Event visualiser app -> DHIS2-9193', function() {
    before(() => {
      login(browser.config.superUser, browser.config.superUserPassword);
      const visualisations = eventVisualiser.visualisationList;
      
      visualisations.forEach(vis => {
        const visName = vis.displayName;
  
        const newTest = it('I open ' + visName, function() {
          getConsoleLog();
          console.log('Opening favorite ' + visName);
      
          eventVisualiser.openFavorite(vis.id);
              
          const dataExist = eventVisualiser.dataExist();
          const consoleLogs = getFilteredConsoleLog();
      
          let reportLog = 'Favorite: \n' + visName + ' has following errors: ';
      
          if (!dataExist) {
            reportLog += '\nNo data exist.';
          }
      
          reportLog += '\nConsole has ' + consoleLogs.length + ' severe errors: \n' + JSON.stringify(consoleLogs, null, 1);
              
          // due to the test being dynamic, these has to be done here instead of using hooks. 
          //reportStep(`I open ${visName}`, 'There should be no console errors', status , reportLog);
          expect(dataExist, "No data exists").to.equal(true);
          expect(consoleLogs.length, reportLog).to.equal(0)
        })
  
        this.tests.push(newTest)
      })
    })
  
    it('1. I open event visualiser', function() {
      eventVisualiser.open();   
    })
  }) 
})
