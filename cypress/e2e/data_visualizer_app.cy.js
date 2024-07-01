import { loadVisualisation } from "../utils/analytics";

describe.skip(
  "Data visualizer -> DHIS2-11216",
  {
    tags: ["smoke"],
    retries: {
      runMode: 3,
      openMode: 1,
    },
  },
  () => {
    const visualizations = Cypress.env("visualizations");

    beforeEach(() => {
      cy.clearConsoleLogs();
    });

    // Check if 'visualizations' is defined and is an array
    if (!Array.isArray(visualizations) || visualizations.length === 0) {
      it("No visualizations defined in Cypress environment", () => {
        cy.log(
          "Skipping tests because no visualizations are defined in Cypress environment"
        );
      });
    } else {
      visualizations.forEach((visualization) => {
        it(visualization.displayName, () => {
          loadVisualisation(visualization.id);

          cy.getConsoleLogs().should((logs) => {
            const reportLog =
              "Visualization: " +
              visualization.displayName +
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
