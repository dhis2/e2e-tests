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
    const flakyApps = [
      "dhis-web-datastore",
      "dhis-web-dashboard",
      "dhis-web-capture",
    ];

    beforeEach(() => {
      cy.clearConsoleLogs();
    });

    // Check if 'apps' is defined and is an array
    if (!Array.isArray(apps) || apps.length === 0) {
      it("No apps defined in Cypress environment", () => {
        cy.log(
          "Skipping tests because no apps are defined in Cypress environment"
        );
      });
    } else {
      apps
        .filter((app) => !flakyApps.includes(app))
        .forEach((app) => {
          it(app, () => {
            cy.visit(app)
              .waitForResources()
              .getConsoleLogs()
              .should((logs) => {
                const reportLog =
                  "App: " +
                  app +
                  " has " +
                  logs.length +
                  " severe errors: \n" +
                  JSON.stringify(logs, null, 1);
                expect(logs, reportLog).to.have.length(0);
              });
          });
        });
    }
  }
);
