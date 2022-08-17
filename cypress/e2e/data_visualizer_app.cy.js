import { loadVisualisation } from '../utils/analytics';
describe('Data visualizer -> DHIS2-11216', () => {
  const visualizations = Cypress.env('visualizations');
  
  beforeEach(() => {
    cy.clearConsoleLogs();
  })
  visualizations.forEach(visualization => {
    it(visualization.displayName, () => {
        loadVisualisation( visualization.id )
        
        cy.getConsoleLogs().should((logs) => {
            const reportLog = 'Visualization: ' + visualization.displayName + ' has ' + logs.length + ' severe errors: \n' + JSON.stringify(logs, null, 1);

            expect(logs, reportLog).to.have.length(0)
          })
    })
  });
})