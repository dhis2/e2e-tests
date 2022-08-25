import moment from 'moment';
require('cypress-plugin-tab');

export const CAPTURE_APP_URL = "dhis-web-capture";

export const Selectors = {
  NEW_EVENT_BUTTON: '[data-test="new-button"]',
  SAVE_BUTTON: '[data-test="main-button"]',
  NEW_EVENT_IN_SELECTED_PROGRAM_BUTTON: '[data-test="new-menuitem-one"] a',
  WORKING_LIST_TABLE: '[data-test="main-page-working-list"]',
  PROGRAM_SELECTOR: '#program-selector .Select-placeholder',
  TABLE_ROWS: 'tbody [data-test="table-row"]',
  DELETE_EVENT_BUTTON: '[data-test="delete-event-button"]',
  EVENT_FORM_ERROR_MESSAGE: '[data-test="error-message-handler"]',
  SPINNER: '[role="progressbar"]' 
}

export const ScopeActions = {
  selectOrgUnitByName: ( name ) => {
    cy.get('[data-test="org-unit-selector-container"] [data-test="capture-ui-input"]')
      .type(name);
  
    cy.contains( '[data-test="dhis2-uiwidgets-orgunittree-node-content"]', name )
      .click(); 
  
    return cy;
  },

  selectProgramByName: ( name ) => {
    cy.get(Selectors.PROGRAM_SELECTOR)
      .click()
    
    cy
      .get('.Select-menu-outer')
      .contains(name)
      .click();
  }
}

export const openApp = () => {
  return cy.visit( CAPTURE_APP_URL ); 
}

export const openEvent = ( eventId ) => {
  return cy.visit(`${CAPTURE_APP_URL}/#viewEvent?viewEventId=${eventId}` );
}

export const openEventList = ( orgUnit, program ) => {
  cy.visit(`dhis-web-capture/index.html#/?orgUnitId=${orgUnit}&programId=${program}`);
  
  cy.get(Selectors.WORKING_LIST_TABLE)
      .should('be.visible');
}

export const openLastSavedEvent = () => {
  cy.url().then((url) => {
    let programId = url.match('(?<=programId=)(.*)')[0];
    let ouId = url.match('(?<=orgUnitId=)(.*)(?=&)')[0];

    cy.request(`api/events.json?program=${programId}&orgUnit=${ouId}&order=created:desc&pageSize=1`)
      .then((response) => {
        return openEvent(response.body.events[0].event)
      })
  })
}

