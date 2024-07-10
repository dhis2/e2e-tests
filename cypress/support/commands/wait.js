import "cypress-wait-until";

Cypress.Commands.add(
  "waitForResources",
  (interval = 1000, timeout = 30000, retry = 5) => {
    cy.log("waiting for resources");

    var retries = retry;
    const getCount = () => {
      const entries = cy
        .state("window")
        .performance.getEntriesByType("resource");

      return entries.length;
    };

    var count = getCount();

    const checkNoNewLong = () => {
      const newCount = getCount();

      if (newCount == count) {
        if (retries <= 0) {
          cy.log("finished waiting");
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
    });
  }
);
