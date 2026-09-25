import { LINE_LISTING_APP, loadLineList } from "../utils/analytics";
import { runSmokeSuite, smokeTitle } from "../utils/smoke";

describe(
  "Line listing -> DHIS2-13221",
  {
    tags: ["smoke"],
    retries: {
      runMode: 3,
      openMode: 1,
    },
  },
  () => {
    const lineLists = Cypress.env("eventVisualizations");

    beforeEach(() => {
      cy.clearConsoleLogs();
      cy.visit(LINE_LISTING_APP);
    });

    runSmokeSuite(lineLists, {
      emptyMessage: "No line lists defined in Cypress environment",
      getTitle: (lineList) =>
        smokeTitle(
          lineList.displayName,
          `Line list ${lineList.id} (missing/invalid displayName)`
        ),
      visit: (lineList) => loadLineList(lineList.id),
      type: "Line list",
    });
  }
);
