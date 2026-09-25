import { runSmokeSuite, smokeTitle } from "../utils/smoke";

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
    const apps = Cypress.env("apps");

    beforeEach(() => {
      cy.clearConsoleLogs();
    });

    runSmokeSuite(apps, {
      emptyMessage: "No apps defined in Cypress environment",
      getTitle: (app) => smokeTitle(app, "App (missing/invalid path)"),
      visit: (app) => cy.visit(app).waitForResources(),
      type: "App",
    });
  }
);
