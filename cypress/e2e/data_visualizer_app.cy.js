import { loadVisualisation } from "../utils/analytics";
import { smokeItems, smokeTitle, checkHasNoErrors } from "../utils/smoke";

describe(
  "Data visualizer -> DHIS2-11216",
  {
    tags: ["smoke"],
    retries: {
      runMode: 3,
      openMode: 1,
    },
  },
  () => {
    const visualizations = smokeItems(
      Cypress.env("visualizations"),
      "No visualizations defined in Cypress environment"
    );

    beforeEach(() => {
      cy.clearConsoleLogs();
    });

    visualizations?.forEach((visualization) => {
      const title = smokeTitle(
        visualization.displayName,
        `Visualization ${visualization.id} (missing/invalid displayName)`
      );

      it(title, () => {
        loadVisualisation(visualization.id);
        checkHasNoErrors("Visualization", title);
      });
    });
  }
);
