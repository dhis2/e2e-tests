describe('Apps -> DHIS2-8017', () => {
  const apps = Cypress.env('apps')
  
  beforeEach(() => {
    cy.clearConsoleLogs();
  })
  apps.forEach((app) => {
    it(app, () => {
      cy.visit(app)
        .waitForResources()
        .getConsoleLogs().should( (logs) => {
          const reportLog = 'App: ' + app + ' has ' + logs.length + ' severe errors: \n' + JSON.stringify(logs, null, 1);
          expect(logs, reportLog).to.have.length(0);
        })

    })

  })

})
