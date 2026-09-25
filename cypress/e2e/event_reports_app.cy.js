import { loadEventReport } from "../utils/analytics";
import { runSmokeSuite, smokeTitle } from "../utils/smoke";

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
    const eventReports = Cypress.env("eventReports");

    beforeEach(() => {
      cy.clearConsoleLogs();
    });

    runSmokeSuite(eventReports, {
      emptyMessage: "No event reports defined in Cypress environment",
      getTitle: (eventReport) =>
        smokeTitle(
          eventReport.displayName,
          `Event report ${eventReport.id} (missing/invalid displayName)`
        ),
      visit: (eventReport) => loadEventReport(eventReport.id),
      type: "Event report",
    });
  }
);
