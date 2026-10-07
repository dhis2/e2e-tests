import { smokeItems, smokeTitle, checkHasNoErrors } from "../utils/smoke";

describe(
  "Apps -> DHIS2-8017",
  {
    tags: ["smoke"],
    retries: {
      runMode: 3,
      openMode: 1,
    },
  },
  () => {
    const apps = smokeItems(
      Cypress.env("apps"),
      "No apps defined in Cypress environment"
    );

    beforeEach(() => {
      cy.clearConsoleLogs();
    });

    apps?.forEach((app) => {
      const title = smokeTitle(app, "App (missing/invalid path)");

      it(title, () => {
        cy.visit(app).waitForResources();
        checkHasNoErrors("App", title);
      });
    });
  }
);
