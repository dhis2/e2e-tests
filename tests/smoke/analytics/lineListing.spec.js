import { login, getConsoleLog } from '#support/action'
import { lineListing } from '#page_objects/analytics/LineListing';
import { checkVisualizationHasNoErrors } from '#support/check';

describe('Line listing app -> DHIS2-8019', function() {
  before(() => {
    login(browser.config.superUser, browser.config.superUserPassword);
    browser.pause(20000);

    const visualizations = lineListing.visualizationList;
    
    for (const vis of visualizations) {
      const visName = vis.displayName;

      const newTest = it('I open ' + visName, function() {
        getConsoleLog();
        console.log('Opening favorite ' + visName);
    
        lineListing.openLineList(vis.id);
        
        checkVisualizationHasNoErrors(visName, lineListing.dataExist())
      })

      this.tests.push(newTest)
    };
  })

  it('1. I open line listing app', function() {
    lineListing.open();
  })
})

