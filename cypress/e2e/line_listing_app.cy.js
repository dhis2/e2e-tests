import { LINE_LISTING_APP, loadLineList } from "../utils/analytics";

describe("Line listing -> DHIS2-13221", { tags: ["smoke"] }, () => {
  const lineLists = Cypress.env("eventVisualizations");

  beforeEach(() => {
    cy.clearConsoleLogs();
    cy.visit(LINE_LISTING_APP);
  });

  // Check if 'lineLists' is defined and is an array
  if (!Array.isArray(lineLists) || lineLists.length === 0) {
    it("No line lists defined in Cypress environment", () => {
      cy.log(
        "Skipping tests because no line lists are defined in Cypress environment"
      );
    });
  } else {
    lineLists.forEach((lineList) => {
      it(lineList.displayName, () => {
        loadLineList(lineList.id);

        cy.getConsoleLogs().should((logs) => {
          const reportLog =
            "Line list: " +
            lineList.displayName +
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
