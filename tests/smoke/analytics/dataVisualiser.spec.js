import { login, getConsoleLog, getFilteredConsoleLog } from '#support/action'
import { dataVisualiser } from '#page_objects/analytics/DataVisualiser';

describe('Data visualiser app -> DHIS2-11216', function() {
  before(() => {
    login(browser.config.superUser, browser.config.superUserPassword);
    const visualisations = dataVisualiser.visualisationList;
    
    visualisations.forEach(vis => {
      const visName = vis.displayName;

      const newTest = it('I open ' + visName, function() {
        getConsoleLog();
        console.log('Opening favorite ' + visName);
    
        dataVisualiser.openFavorite(vis.id);
            
        const dataExist = dataVisualiser.dataExist();
        const consoleLogs = getFilteredConsoleLog();
    
        let reportLog = 'Favorite: \n' + visName + ' has following errors: ';
    
        if (!dataExist) {
          reportLog += '\nNo data exist.';
        }
    
        reportLog += '\nConsole has ' + consoleLogs.length + ' severe errors: \n' + JSON.stringify(consoleLogs, null, 1);
          
        expect(dataExist, 'No data exists').to.equal(true);
        expect(consoleLogs.length, reportLog).to.equal(0)
      })

      this.tests.push(newTest)
    })
  })

  it('1. I open data visualiser app', function() {
    dataVisualiser.open();

    dataVisualiser.gettingStartedElement.waitForExist();
    expect(dataVisualiser.gettingStartedElement.isDisplayed()).to.equal(true);
  })
})
