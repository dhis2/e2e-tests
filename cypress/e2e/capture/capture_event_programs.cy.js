/// <reference types="cypress" />

import { openApp,
  openEvent,
  Selectors,
  ScopeActions,
  openEventList
} from '../../utils/capture/capture'

import { getCommentByValue, addComment, fillEventForm, Selectors as NewEventPage } from '../../utils/capture/capture_new_event_page'

import { getCurrentUserDisplayName, createEventInEventProgram } from '../../utils/api'

describe('Capture: event programs', () => {
  beforeEach(() => {
    openApp();
  })

  it('should open new event form', () => {
    ScopeActions.selectOrgUnitByName('Ngelehun CHC')
    ScopeActions.selectProgramByName('Information Campaign')
    cy
      .get(Selectors.NEW_EVENT_BUTTON)
      .click()
      .get(Selectors.NEW_EVENT_IN_SELECTED_PROGRAM_BUTTON)
      .click()
  
    cy.get(NewEventPage.NEW_EVENT_FORM).should('be.visible')
  })
  
  it('should create event', () => {
    const comment = "Test comment";
    cy.visit('dhis-web-capture/index.html#/new?orgUnitId=DiszpKrYNg8&programId=q04UBOqq3rp');
    cy.intercept('POST','**/tracker*').as('post');

    fillEventForm();
    addComment( comment)
    
    cy.get(Selectors.SAVE_BUTTON)
      .click();

    cy.wait('@post').then((interception) => {
      cy.log(interception.response.body.bundleReport.typeReportMap['EVENT'])
        cy.wrap(interception.response.body.bundleReport.typeReportMap['EVENT'].objectReports[0].uid).as('eventId');
        
    })
    
    cy.location('href').should('not.contain', 'new');
    cy.get(Selectors.WORKING_LIST_TABLE)
      .should('be.visible');
    cy.get('@eventId').then((eventId) => {
      openEvent(eventId)
    })

    getCurrentUserDisplayName().then( displayName => {
      getCommentByValue(comment)
      .get('[data-test=comment-user]' )
      .should('have.text', displayName)
    })
  })

  it('should delete event', () => {
    const orgUnit = "DiszpKrYNg8"
    const program = "lxAQ7Zs9VYR"

    createEventInEventProgram(orgUnit, program)
      .then(eventId => {
        openEventList(orgUnit, program);

        cy.get(Selectors.TABLE_ROWS)
          .filter('#' + eventId).within((el) => {
           cy.get(el).find('[data-test="event-content-menu"]')
             .click()
        })

        cy.get(Selectors.DELETE_EVENT_BUTTON)
          .click()
          .get(Selectors.SPINNER)
          .should('not.exist')

  
        cy.get(Selectors.TABLE_ROWS)
          .filter('#' + eventId)
          .should('not.exist');

        openEvent(eventId); 

        cy.get(Selectors.EVENT_FORM_ERROR_MESSAGE)
          .should('contain', 'Event could not be loaded. Are you sure it exists?' )
            
      }) 
    
  })
   
})