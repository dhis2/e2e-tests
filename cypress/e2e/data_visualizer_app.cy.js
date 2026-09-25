import { loadVisualisation } from "../utils/analytics";
import { runSmokeSuite, smokeTitle } from "../utils/smoke";

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
    const visualizations = Cypress.env("visualizations");

    beforeEach(() => {
      cy.clearConsoleLogs();
    });

    runSmokeSuite(visualizations, {
      emptyMessage: "No visualizations defined in Cypress environment",
      getTitle: (visualization) =>
        smokeTitle(
          visualization.displayName,
          `Visualization ${visualization.id} (missing/invalid displayName)`
        ),
      visit: (visualization) => loadVisualisation(visualization.id),
      type: "Visualization",
    });
  }
);
