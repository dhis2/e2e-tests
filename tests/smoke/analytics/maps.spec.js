import { login, getConsoleLog, getFilteredConsoleLog } from '#support/action'
import { maps } from '#page_objects/analytics/Maps';


describe('Maps app -> DHIS2-8021', function() {
  before(() => {
    login(browser.config.superUser, browser.config.superUserPassword);
    const visualisations = maps.visualisationList;
    
    visualisations.forEach(vis => {
      const visName = vis.displayName;

      const newTest = it('I open ' + visName, function() {
        getConsoleLog();
        console.log('Opening favorite ' + visName);
    
        maps.openFavorite(vis.id);
            
        const dataExist = maps.dataExist();
        const consoleLogs = getFilteredConsoleLog();
    
        let reportLog = 'Favorite: \n' + visName + ' has following errors: ';
    
        if (!dataExist) {
          reportLog += '\nNo data exist.';
        }
    
        reportLog += '\nConsole has ' + consoleLogs.length + ' severe errors: \n' + JSON.stringify(consoleLogs, null, 1);
        
        expect(dataExist, "No data exists").to.equal(true);
        expect(consoleLogs.length, reportLog).to.equal(0)
      })

      this.tests.push(newTest)
    })
  })

  it('1. I open maps', () => {
      maps.open();

      maps.mapsContainerElement.waitForExist();
      expect(maps.mapsContainerElement.isDisplayed()).to.equal(true);
  })
})

