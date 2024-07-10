import "cypress-wait-until";

Cypress.Commands.add(
  "waitForResources",
  (interval = 1000, timeout = 30000, retry = 5) => {
    cy.log("waiting for resources");

    var retries = retry;
    let checkCount = 0; // Counter for the number of checks performed
    let lastEntryCount = 0; // Last count of entries for comparison

    const getCount = () => {
      const entries = cy
        .state("window")
        .performance.getEntriesByType("resource");

      return entries.length;
    };

    var count = getCount();

    const checkNoNewLong = () => {
      checkCount++; // Increment the check counter
      const newCount = getCount();
      lastEntryCount = newCount;

      cy.log(`Check #${checkCount}: ${newCount} resources loaded.`);

      if (newCount == count) {
        if (retries <= 0) {
          cy.log("finished waiting");
          cy.log(`Total checks performed: ${checkCount}`);
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
    }).then(() => {
      cy.log(`Final resource count: ${lastEntryCount}`);
      cy.log(`Total checks performed: ${checkCount}`);
    });
  }
);
