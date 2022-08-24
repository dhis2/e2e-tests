import { openApp, Selectors, ScopeActions, fillEventForm, enterValueByAttribute, selectValueByAttribute, enterEventDate } from '../../utils/capture/capture';
import moment from 'moment'
import { Selectors as EnrollmentDashboard } from '../../utils/capture/capture_enrollment_dashboard'
describe('Capture: tracker programs', () => {

  beforeEach(() => {
    openApp();
  })

  it('should create TEI', () => {
    ScopeActions.selectOrgUnitByName('Ngelehun CHC')
    ScopeActions.selectProgramByName('Child Programme')

    cy.get(Selectors.NEW_EVENT_BUTTON)
      .click()
      .get(Selectors.NEW_EVENT_IN_SELECTED_PROGRAM_BUTTON)
      .click();

    //fillEventForm()
  
    enterEventDate('1993-10-16')
    enterValueByAttribute('First name',`${moment().format()}`)
    enterValueByAttribute('Last name', `${moment().format()}`)
    selectValueByAttribute('Gender', 'Female')
    
    cy.get('[data-test="create-and-link-button"]')
      .click()

    cy.get(EnrollmentDashboard.ENROLLMENT_PAGE)
      .should('be.visible')

  })
})