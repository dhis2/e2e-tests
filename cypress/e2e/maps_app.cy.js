import { loadMap } from "../utils/analytics";
import { smokeItems, smokeTitle, checkHasNoErrors } from "../utils/smoke";

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
    const maps = smokeItems(
      Cypress.env("maps"),
      "No maps defined in Cypress environment"
    );

    beforeEach(() => {
      cy.clearConsoleLogs();
    });

    maps?.forEach((map) => {
      const title = smokeTitle(
        map.displayName,
        `Map ${map.id} (missing/invalid displayName)`
      );

      it(title, () => {
        loadMap(map.id);
        checkHasNoErrors("Map", title, { checkNoData: true });
      });
    });
  }
);
