import moment from 'moment';
require('cypress-plugin-tab');

export const CAPTURE_APP_URL = "dhis-web-capture";

export const Selectors = {
  NEW_EVENT_BUTTON: '[data-test="new-button"]',
  SAVE_BUTTON: '[data-test="main-button"]',
  NEW_EVENT_BUTTON : '[data-test="new-button"]',
  NEW_EVENT_IN_SELECTED_PROGRAM_BUTTON: '[data-test="new-menuitem-one"] a',
  WORKING_LIST_TABLE: '[data-test="main-page-working-list"]',
  NEW_EVENT_FORM: '[data-test="registration-page-content"]',
  PROGRAM_SELECTOR: '#program-selector .Select-placeholder',
  NEW_EVENT_FORM: '[data-test=registration-page-content]'
}

export const ContextActions = {
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

export const fillEventForm = () => {
  cy.get( Selectors.NEW_EVENT_FORM ).should('be.visible');
  cy.get('[data-test="capture-ui-input"][placeholder="yyyy-mm-dd"]')
    .each(($el, input, $list) => {
      let date = moment().format('YYYY-MM-DD');
      cy.wrap($el)
        .type( date );
      
      cy.get(`li[data-date=${date}]`).click();
      cy.get('[data-test="date-calendar-wrapper"]').should('not.be', 'displayed');
    });

  cy.get('[class*=Select-control]')
    .each(($el) => {
      cy.wrap($el)
        .click()
        .get('.Select-menu-outer')
        .last()
        .click();
    })

  cy.get('[class*="textFieldCustomForm"] [data-test="capture-ui-input"]')
    .each(($el) => {
      cy.wrap($el)
      .type('33');
    });
}

export const addComment = ( comment ) => {
  cy.get('[data-test="new-comment-button"]')
    .click();

  cy.get('[data-test="comment-textfield"]')
    .type(comment);

  cy.get('[data-test="comment-buttons-container"] button').first().click();
}

export const openEvent = ( eventId ) => {
  return cy.visit(`${CAPTURE_APP_URL}/#viewEvent?viewEventId=${eventId}` );
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

export const getCommentByValue = ( value ) => {
    return cy.get('[data-test="comments-list"]')
      .contains(value);
}