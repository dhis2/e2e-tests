import { loadEventReport } from '../utils/analytics'

describe('Event reports -> DHIS2-8019', () => {
  const eventReports = Cypress.env('eventReports');
  
  beforeEach(() => {
    cy.clearConsoleLogs();
  })
  eventReports.forEach(eventReport => {
    it(eventReport.displayName, () => {
      loadEventReport( eventReport.id );

      cy.getConsoleLogs().should((logs) => {
        const reportLog = 'Event report: ' + eventReport.displayName + ' has ' + logs.length + ' severe errors: \n' + JSON.stringify(logs, null, 1);

        expect(logs, reportLog).to.have.length(0)
      })
    })
  });

})