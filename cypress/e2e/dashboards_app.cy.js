import {
  openDashboard,
  DASHBOARD_SCROLL_BAR,
  ALL_DASHBOARD_ITEMS,
  LOADED_DASHBOARD_ITEMS,
  openApp,
} from "../utils/dashboard";

describe(
  "Dashboards -> DHIS2-8010",
  {
    tags: ["smoke"],
    retries: {
      runMode: 3,
      openMode: 1,
    },
  },
  () => {
    const dashboards = Cypress.env("dashboards");

    beforeEach(() => {
      openApp();
      cy.clearConsoleLogs();
    });

    // Check if 'dashboards' is defined and is an array
    if (!Array.isArray(dashboards) || dashboards.length === 0) {
      it("No dashboards defined in Cypress environment", () => {
        cy.log(
          "Skipping tests because no dashboards are defined in Cypress environment"
        );
      });
    } else {
      dashboards.forEach((dashboard) => {
        it(dashboard.displayName, () => {
          openDashboard(dashboard.id);
          scrollDown();

          cy.waitForResources()
            .getConsoleLogs()
            .should((logs) => {
              const reportLog =
                "Dashboard: " +
                dashboard.name +
                " has " +
                logs.length +
                " severe errors: \n" +
                JSON.stringify(logs, null, 1);
              expect(logs, reportLog).to.have.length(0);
            });
        });
      });
    }
  }
);

function scrollDown(i = 1) {
  const maxScrolls = 5; // Max number of scrolls to prevent potential infinite recursion
  const resolution = Cypress.config("viewportHeight");
  cy.log(`Scroll Attempt: ${i}`);

  if (i > maxScrolls) {
    cy.log("Max scrolls reached, stopping");
    return;
  }

  cy.get(LOADED_DASHBOARD_ITEMS).then((visibleItems) => {
    cy.get(ALL_DASHBOARD_ITEMS).then((allItems) => {
      if (Cypress.$(allItems).length > Cypress.$(visibleItems).length) {
        cy.get(DASHBOARD_SCROLL_BAR)
          .scrollTo(0, resolution * i)
          .then(() => {
            cy.log(`Scrolled to position: ${resolution * i}`);
            cy.waitForResources().then(() => {
              scrollDown(i + 1); // Proceed to the next recursion after waitForResources completes
            });
          });
      } else {
        cy.log("All items loaded, no further scrolling required");
      }
    });
  });
}
