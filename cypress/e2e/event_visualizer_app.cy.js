import { loadEventChart } from "../utils/analytics";

describe(
  "Event visualizer -> DHIS2-9193",
  {
    tags: ["smoke"],
    retries: {
      runMode: 3,
      openMode: 1,
    },
  },
  () => {
    const eventCharts = Cypress.env("eventCharts");

    beforeEach(() => {
      cy.clearConsoleLogs();
    });

    // Check if 'eventCharts' is defined and is an array
    if (!Array.isArray(eventCharts) || eventCharts.length === 0) {
      it("No event charts defined in Cypress environment", () => {
        cy.log(
          "Skipping tests because no event charts are defined in Cypress environment"
        );
      });
    } else {
      eventCharts.forEach((chart) => {
        it(chart.displayName, () => {
          loadEventChart(chart.id);

          cy.getConsoleLogs().should((logs) => {
            const reportLog =
              "Event visualization: " +
              chart.displayName +
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
