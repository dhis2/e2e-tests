import { loadMap, checkVisualizationHasNoErrors } from '../utils/analytics';

describe('Maps -> DHIS2-8021', () => {
  const maps = Cypress.env('maps'); 
  console.table(maps);
  
  beforeEach(() => {
    cy.clearConsoleLogs();
  })
  maps.forEach((map) => {
    it(map.displayName, () => {
      loadMap(map.id); 

      checkVisualizationHasNoErrors('Map', map.displayName)
    })
  })
})