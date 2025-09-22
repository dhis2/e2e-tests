export const DASHBOARD_APP_URL = "dhis-web-dashboard";
export const DASHBOARD_SCROLL_BAR = "[data-test=inner-scroll-container]";
export const LOADED_DASHBOARD_ITEMS = "iframe";
export const TEXT_DASHBOARD_ITEMS = ".TEXT";
export const ALL_DASHBOARD_ITEMS = ".react-grid-layout > div";
export const DASHBOARD_BAR_CONTAINER = "[data-test=dashboardsbar-container]";

export const openDashboard = (uid) => {
  cy.visit(DASHBOARD_APP_URL + "/?redirect=false#/" + uid);
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(4000); // don't remove !
  cy.get("[data-test=dhis2-uicore-circularloader]", { timeout: 15000 }).should(
    "not.exist"
  );
};

export const openApp = () => {
  cy.visit(DASHBOARD_APP_URL);
};
