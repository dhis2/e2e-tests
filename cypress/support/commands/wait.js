import "cypress-wait-until";

Cypress.Commands.add("waitForResources", (interval = 3000, timeout = 30000) => {
  cy.log("Starting waitForResources");

  const start = Date.now();
  let previousLength = 0;

  const checkResources = () => {
    return cy.window().then((win) => {
      const now = Date.now();
      const entries = win.performance.getEntriesByType("resource");
      const currentLength = entries.length;

      cy.log(`Time elapsed: ${now - start}ms`);
      cy.log(`Resource entries: ${currentLength}`);

      if (now - start > timeout) {
        cy.log("Timeout reached, stopping waitForResources");
        return true;
      }

      if (currentLength === previousLength) {
        cy.log("No new resources loaded, stopping waitForResources");
        return true;
      }

      previousLength = currentLength;
      return cy.wait(interval).then(checkResources);
    });
  };

  return checkResources();
});
