export const EVENT_REPORTS_APP_URL = "dhis-web-event-reports"; 
export const DATA_VISUALIZER_APP_URL = "dhis-web-data-visualizer";
export const EVENT_VISUALIZER_APP_URL = "dhis-web-event-visualizer"; 
export const MAPS_APP_URL = "dhis-web-maps"; 
export const LINE_LISTING_APP = "api/apps/line-listing/index.html";
export const Selectors = {
  VISUALIZATION_TITLE: '[data-test="AO-title"]',
  LOADER: '[data-test="dhis2-uicore-circularloader"]'
}

export const MAP_CONTAINER = "#dhis2-map-container .dhis2-map";

export const loadVisualisation = ( uid ) => {
  cy.visit(`${DATA_VISUALIZER_APP_URL}/#/${uid}`);
  waitForVisualization();
}
export const loadEventReport = ( uid ) => {
  return cy.visit(`${EVENT_REPORTS_APP_URL}/?id=${uid}`).waitForResources();
}

export const loadEventChart = ( uid ) => {
  return cy.visit(`${EVENT_VISUALIZER_APP_URL}?id=${uid}`).waitForResources();
}

export const loadMap = ( uid ) => {
  cy.visit(`${MAPS_APP_URL}/?id=${uid}`)
    .waitForResources();
}  

export const loadLineList = ( uid ) =>  {
  cy.visit(`${LINE_LISTING_APP}#/${uid}`);
  waitForVisualization();
}

export const waitForVisualization = () => {
  cy.get(Selectors.VISUALIZATION_TITLE, {timeout: 10000}).should('be.visible')

  cy.get(Selectors.LOADER).should('not.exist');
}

export const checkVisualizationHasNoErrors = ( type, visualization ) => {
  cy.getConsoleLogs().should((logs) => {
    const reportLog = `${type}: ${visualization} has ${logs.length} severe errors: \n ${JSON.stringify(logs,null,1)}}`;
    
    cy.contains('No data', {
      matchCase: false, 
      timeout: 1000
    }).should('not.exist')
    expect(logs, reportLog).to.have.length(0);
  })

}