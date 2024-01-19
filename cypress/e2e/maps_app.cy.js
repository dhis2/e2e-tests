import { loadMap, checkVisualizationHasNoErrors } from "../utils/analytics";

describe(
  "Maps -> DHIS2-8021",
  {
    tags: ["smoke"],
    retries: {
      runMode: 3,
      openMode: 1,
    },
  },
  () => {
    const maps = Cypress.env("maps");
    console.table(maps);

    beforeEach(() => {
      cy.clearConsoleLogs();
    });

    // Check if 'maps' is defined and is an array
    if (!Array.isArray(maps) || maps.length === 0) {
      it("No maps defined in Cypress environment", () => {
        cy.log(
          "Skipping tests because no maps are defined in Cypress environment"
        );
      });
    } else {
      maps.forEach((map) => {
        it(map.displayName, () => {
          loadMap(map.id);
          checkVisualizationHasNoErrors("Map", map.displayName);
        });
      });
    }
  }
);
