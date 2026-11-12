export const EVENT_REPORTS_APP_URL = "dhis-web-event-reports";
export const DATA_VISUALIZER_APP_URL = "dhis-web-data-visualizer/?redirect=false";
export const EVENT_VISUALIZER_APP_URL = "dhis-web-event-visualizer";
export const MAPS_APP_URL = "dhis-web-maps";
export const LINE_LISTING_APP = "dhis-web-line-listing/?redirect=false";
export const Selectors = {
  LOADER: '[data-test="dhis2-uicore-circularloader"]',
  VISUALIZATION_TITLE: '[data-test="titlebar"]',
};

export const MAP_CONTAINER = "#dhis2-map-container .dhis2-map";

export const loadVisualisation = (uid) => {
  cy.visit(`${DATA_VISUALIZER_APP_URL}#/${uid}`);
  waitForVisualization(Selectors.VISUALIZATION_TITLE);
};
export const loadEventReport = (uid) => {
  return cy.visit(`${EVENT_REPORTS_APP_URL}/?id=${uid}`).waitForResources();
};

export const loadEventChart = (uid) => {
  return cy.visit(`${EVENT_VISUALIZER_APP_URL}?id=${uid}`).waitForResources();
};

export const loadMap = (uid) => {
  cy.visit(`${MAPS_APP_URL}/?id=${uid}`).waitForResources();
};

export const loadLineList = (uid) => {
  cy.visit(`${LINE_LISTING_APP}#/${uid}`);
  waitForVisualization(Selectors.VISUALIZATION_TITLE);
};

export const waitForVisualization = (title) => {
  // workaround while waiting for consistent data-test for VISUALIZATION_TITLE
  cy.get(title, { timeout: 20000 }).should("be.visible");

  cy.get(Selectors.LOADER).should("not.exist");
};
