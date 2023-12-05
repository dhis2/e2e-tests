import { loadEventChart } from '../utils/analytics';

describe('Event visualizer -> DHIS2-9193', { tags: ['smoke'] }, () => {

  const eventCharts = Cypress.env('eventCharts'); 
  
  beforeEach(() => {
    cy.clearConsoleLogs();
  })
  eventCharts.forEach( chart  => {
    it(chart.displayName, () => {
      cy.setTestDescription('TEST DESCRIPTION...')
      cy.addTestAttributes([
        { key: 'feature', value: 'TESTFEATURE' },
        { key: 'type', value: 'TESTFEATURETYPE' },
        { key: 'testid', value: 'REQ-111' },
      ])
      cy.setTestCaseId('REQ-123');
      cy.setTestCaseId('EVENT_VISUALIZER_SUITE_TestCaseId', 'EVENT_VISUALIZER_SUITE_ID');
      loadEventChart(chart.id); 

      cy.getConsoleLogs().should((logs) => {
        const reportLog = 'Event visualization: ' + chart.displayName + ' has ' + logs.length + ' severe errors: \n' + JSON.stringify(logs, null, 1);

        expect(logs, reportLog).to.have.length(0)
      })
    })
  });
})