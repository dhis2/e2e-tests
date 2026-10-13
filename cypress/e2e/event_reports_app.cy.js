import { loadEventReport } from "../utils/analytics";
import { smokeItems, smokeTitle, checkHasNoErrors } from "../utils/smoke";

describe(
  "Event reports -> DHIS2-8019",
  {
    tags: ["smoke"],
    retries: {
      runMode: 3,
      openMode: 1,
    },
  },
  () => {
    const eventReports = smokeItems(
      Cypress.env("eventReports"),
      "No event reports defined in Cypress environment"
    );

    beforeEach(() => {
      cy.clearConsoleLogs();
    });

    eventReports?.forEach((eventReport) => {
      const title = smokeTitle(
        eventReport.displayName,
        `Event report ${eventReport.id} (missing/invalid displayName)`
      );

      it(title, () => {
        loadEventReport(eventReport.id);
        checkHasNoErrors("Event report", title);
      });
    });
  }
);
