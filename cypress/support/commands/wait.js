import "cypress-wait-until";

Cypress.Commands.add("waitForResources", (interval = 1000, timeout = 30000) => {
  cy.log("waiting for resources");

  const start = Date.now();
  const checkResources = () => {
    const now = Date.now();
    const entries = cy.state("window").performance.getEntriesByType("resource");

    if (now - start > timeout || entries.length === 0) {
      cy.log("finished waiting");
      return true;
    }

    cy.wait(interval).then(checkResources);
  };

  checkResources();
});
