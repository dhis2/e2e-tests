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
      runMode: 2,
      openMode: 1,
    },
  },
  () => {
    const dashboards = Cypress.env("dashboards");
    const flakyDashboards = [
      "Immunization",
      "Immunization data",
      "Inpatient Morbidity Mortality",
      "Malnutrition",
      "Measles (user org unit)",
      "Mother and Child Health",
      "Reporting Rates",
    ];

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
      dashboards
        .filter((dashboard) => !flakyDashboards.includes(dashboard.displayName))
        .forEach((dashboard) => {
          it(dashboard.displayName, () => {
            openDashboard(dashboard.id);
            scrollDown();

            cy.waitForResources()
              .getConsoleLogs()
              .should((logs) => {
                const reportLog =
                  "Dashboard: " +
                  dashboard.displayName +
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
  const resolution = Cypress.config("viewportHeight");
  if (i > 20) {
    return;
  }

  cy.get(LOADED_DASHBOARD_ITEMS).then((visibleItems) => {
    cy.get(ALL_DASHBOARD_ITEMS).then((allItems) => {
      if (Cypress.$(allItems).length != Cypress.$(visibleItems).length) {
        cy.get(DASHBOARD_SCROLL_BAR)
          .scrollTo(0, resolution * i)
          .waitForResources();

        scrollDown(i + 1);
      }

      return cy.wrap(allItems);
    });
  });
}
