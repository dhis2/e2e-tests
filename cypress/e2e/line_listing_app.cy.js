import { LINE_LISTING_APP, loadLineList } from "../utils/analytics";
import { smokeItems, smokeTitle, checkHasNoErrors } from "../utils/smoke";

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
    const lineLists = smokeItems(
      Cypress.env("eventVisualizations"),
      "No line lists defined in Cypress environment"
    );

    beforeEach(() => {
      cy.clearConsoleLogs();
      cy.visit(LINE_LISTING_APP);
    });

    lineLists?.forEach((lineList) => {
      const title = smokeTitle(
        lineList.displayName,
        `Line list ${lineList.id} (missing/invalid displayName)`
      );

      it(title, () => {
        loadLineList(lineList.id);
        checkHasNoErrors("Line list", title);
      });
    });
  }
);
