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

// Scrolls until every dashboard item is rendered. Some items (e.g. REPORTS or an
// item without a type) never match LOADED_DASHBOARD_ITEMS, so also stop once the
// bottom of the dashboard has been reached instead of always scrolling to the cap.
function scrollDown(i = 1) {
  const resolution = Cypress.config("viewportHeight");
  if (i > 20) {
    return;
  }

  cy.get(LOADED_DASHBOARD_ITEMS).then((visibleItems) => {
    cy.get(ALL_DASHBOARD_ITEMS).then((allItems) => {
      if (allItems.length === visibleItems.length) {
        return;
      }

      cy.get(DASHBOARD_SCROLL_BAR).then(($bar) => {
        const bar = $bar[0];
        const atBottom = bar.scrollTop + bar.clientHeight >= bar.scrollHeight - 1;
        if (i > 1 && atBottom) {
          return;
        }

        cy.wrap($bar)
          .scrollTo(0, resolution * i)
          .waitForResources();

        scrollDown(i + 1);
      });
    });
  });
}
