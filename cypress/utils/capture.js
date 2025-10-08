import moment from "moment";
require("cypress-plugin-tab");

export const CAPTURE_APP_URL = "dhis-web-capture/?redirect=false#";

export const Selectors = {
  NEW_EVENT_BUTTON: '[data-test="new-button-toggle"]',
  SAVE_BUTTON: '[data-test="main-button"]',
  SAVE_TEI_BUTTON: '[data-test="dhis2-uicore-splitbutton-button"]',
  NEW_EVENT_IN_SELECTED_PROGRAM_BUTTON: '[data-test="new-menuitem-one"]',
  WORKING_LIST_TABLE: '[data-test="main-page-working-list"]',
  NEW_EVENT_FORM: '[data-test="registration-page-content"]',
  PROGRAM_SELECTOR: '[data-test="program-selector-container"]',
  PROGRAM_MENULIST_SELECTOR: '[data-test="dhis2-uicore-menulist"]',
  ORG_UNIT_CONTAINER_SELECTOR: '[data-test="org-unit-selector-container"]',
  ORG_UNIT_INPUT_SELECTOR: 'input[placeholder="Search"]',
};

export const ContextActions = {
  selectOrgUnitByName: (name) => {
    cy.get(Selectors.ORG_UNIT_CONTAINER_SELECTOR).click();
    cy.get(Selectors.ORG_UNIT_INPUT_SELECTOR).type(name);
    cy.contains(name).click();

    return cy;
  },

  selectProgramByName: (name) => {
    cy.get(Selectors.PROGRAM_SELECTOR).click();
    cy.get(Selectors.PROGRAM_MENULIST_SELECTOR).contains(name).click();
  },
};

export const openApp = () => {
  return cy.visit(CAPTURE_APP_URL);
};

export const fillEventForm = () => {
  cy.get(Selectors.NEW_EVENT_FORM).should("be.visible");
  cy.get('input[placeholder="yyyy-mm-dd"]').each(($el) => {
    let date = moment().format("YYYY-MM-DD");
    cy.wrap($el).type(date).as("date-field");
    cy.get("@date-field").blur();
    cy.get('[data-test="date-calendar-wrapper"]').should("not.be", "displayed");
  });

  cy.get("[class*=Select-control]").each(($el) => {
    cy.wrap($el).click().get(".Select-menu-outer").last().click();
  });

  cy.get('[class*="textFieldCustomForm"] input').each(($el) => {
    cy.wrap($el).type("33");
  });
};

export const addNote = (note) => {
  cy.get(
    '[data-test="new-note-container"] [data-test="write-note-btn"]'
  ).click();

  cy.get('[data-test="note-textfield"]').type('note').blur();
  
  cy.get('[data-test="note-buttons-container"] button').first().click();
  cy.get('[data-test="note-text"]').contains(note);
};

export const openEvent = (eventId) => {
  return cy.visit(`${CAPTURE_APP_URL}viewEvent?viewEventId=${eventId}`);
};

export const openLastSavedEvent = () => {
  cy.url().then((url) => {
    let programId = url.match("(?<=programId=)(.*)")[0];
    let ouId = url.match("(?<=orgUnitId=)(.*)(?=&)")[0];

    cy.request(
      `api/events.json?program=${programId}&orgUnit=${ouId}&order=created:desc&pageSize=1`
    ).then((response) => {
      return openEvent(response.body.events[0].event);
    });
  });
};

export const getNoteByValue = (value) => {
  return cy.contains(value);
};