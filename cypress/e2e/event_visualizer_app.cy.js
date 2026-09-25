import { loadEventChart } from "../utils/analytics";
import { smokeItems, smokeTitle, checkHasNoErrors } from "../utils/smoke";

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
    const eventCharts = smokeItems(
      Cypress.env("eventCharts"),
      "No event charts defined in Cypress environment"
    );

    beforeEach(() => {
      cy.clearConsoleLogs();
    });

    eventCharts?.forEach((chart) => {
      const title = smokeTitle(
        chart.displayName,
        `Event visualization ${chart.id} (missing/invalid displayName)`
      );

      it(title, () => {
        loadEventChart(chart.id);
        checkHasNoErrors("Event visualization", title);
      });
    });
  }
);
