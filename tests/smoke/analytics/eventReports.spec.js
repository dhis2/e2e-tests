import { login, getConsoleLog, getFilteredConsoleLog } from '#support/action'
import { eventReports } from '#page_objects/analytics/EventReports';
import { checkVisualizationHasNoErrors } from '#support/check';

describe('Event reports app -> DHIS2-8019', function() {
    before(() => {
      login(browser.config.superUser, browser.config.superUserPassword);
      const visualizations = eventReports.visualizationList;
      
      visualizations.forEach(vis => {
        const visName = vis.displayName;

        const newTest = it('I open ' + visName, function() {
          getConsoleLog();
          console.log('Opening favorite ' + visName);
      
          eventReports.openFavorite(vis.id);
          
          checkVisualizationHasNoErrors(visName, eventReports.dataExist())
        })

        this.tests.push(newTest)
      });
    })

  it('1. I open event reports app', function() {
     eventReports.open();
  })
})

