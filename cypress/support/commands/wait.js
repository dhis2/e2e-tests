import "cypress-wait-until";

Cypress.Commands.add(
  "waitForResources",
  (interval = 1000, timeout = 30000, retry = 5) => {
    cy.log("waiting for resources").then(() => {
      var retries = retry;
      const getCount = () => {
        const entries = cy
          .state("window")
          .performance.getEntriesByType("resource");
        return entries.length;
      };

      var count = getCount();
      cy.log(`Initial resource count: ${count}`);

      const checkNoNewLong = () => {
        const newCount = getCount();
        cy.log(`New resource count: ${newCount}, retries left: ${retries}`);

        if (newCount == count) {
          if (retries <= 0) {
            cy.log("Finished waiting for resources.");
            return true;
          }
          retries--;
          return false;
        } else {
          retries = retry;
          count = newCount;
          return false;
        }
      };

      cy.waitUntil(() => Promise.resolve(checkNoNewLong()), {
        interval: interval,
        timeout: timeout,
        errorMsg: `Waiting for resources timed out after ${timeout}ms`,
      });
    });
  }
);
