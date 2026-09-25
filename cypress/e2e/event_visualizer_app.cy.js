import { loadEventChart } from "../utils/analytics";
import { runSmokeSuite, smokeTitle } from "../utils/smoke";

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

    runSmokeSuite(eventCharts, {
      emptyMessage: "No event charts defined in Cypress environment",
      getTitle: (chart) =>
        smokeTitle(
          chart.displayName,
          `Event visualization ${chart.id} (missing/invalid displayName)`
        ),
      visit: (chart) => loadEventChart(chart.id),
      type: "Event visualization",
    });
  }
);
