import { loadEventReport } from "../utils/analytics";

describe.skip("Event reports -> DHIS2-8019", { tags: ["smoke"] }, () => {
  const eventReports = Cypress.env("eventReports");

  beforeEach(() => {
    cy.clearConsoleLogs();
  });

  // Check if 'eventReports' is defined and is an array
  if (!Array.isArray(eventReports) || eventReports.length === 0) {
    it("No event reports defined in Cypress environment", () => {
      cy.log(
        "Skipping tests because no event reports are defined in Cypress environment"
      );
    });
  } else {
    eventReports.forEach((eventReport) => {
      it(eventReport.displayName, () => {
        loadEventReport(eventReport.id);

        cy.getConsoleLogs().should((logs) => {
          const reportLog =
            "Event report: " +
            eventReport.displayName +
            " has " +
            logs.length +
            " severe errors: \n" +
            JSON.stringify(logs, null, 1);

          expect(logs, reportLog).to.have.length(0);
        });
      });
    });
  }
});
