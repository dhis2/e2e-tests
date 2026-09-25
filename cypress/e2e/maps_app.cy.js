import { loadMap } from "../utils/analytics";
import { runSmokeSuite, smokeTitle } from "../utils/smoke";

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

    beforeEach(() => {
      cy.clearConsoleLogs();
    });

    runSmokeSuite(maps, {
      emptyMessage: "No maps defined in Cypress environment",
      getTitle: (map) =>
        smokeTitle(
          map.displayName,
          `Map ${map.id} (missing/invalid displayName)`
        ),
      visit: (map) => loadMap(map.id),
      type: "Map",
      checkNoData: true,
    });
  }
);
