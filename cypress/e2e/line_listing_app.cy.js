import { LINE_LISTING_APP, loadLineList } from "../utils/analytics";

describe("Line listing -> DHIS2-13221", { tags: ["smoke"] }, () => {
  const lineLists = Cypress.env("eventVisualizations");

  before(() => {
    if (!Array.isArray(lineLists) || lineLists.length === 0) {
      cy.log(
        "Line listing app feature tests are skipped for this DHIS2 version (V37) as the feature is not developed yet."
      );
      this.skip();
    }
  });
});
