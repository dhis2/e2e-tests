import { openApp, Selectors, ScopeActions } from '../../utils/capture/capture';
import { Selectors as NewTeiForm,
  enterValueByAttribute, 
  selectValueByAttribute, 
  enterEventDate
 } from '../../utils/capture/capture_new_tei_page';
import moment from 'moment'
import { Selectors as EnrollmentDashboard } from '../../utils/capture/capture_enrollment_dashboard'
describe('Capture: tracker programs', () => {
  beforeEach(() => {
    openApp();

    // opt-in for tracker features in capture
    cy.request('PUT', '/api/dataStore/capture/useNewDashboard', {
      IpHINAT79UW: true
    })
  })

  it('should create TEI', () => {
    ScopeActions.selectOrgUnitByName('Ngelehun CHC')
    ScopeActions.selectProgramByName('Child Programme')

    cy.get(Selectors.NEW_EVENT_BUTTON)
      .click()
      .get(Selectors.NEW_EVENT_IN_SELECTED_PROGRAM_BUTTON)
      .click();
  
    // todo fix the date entering - it sometimes doesn't work
    enterEventDate('1993-10-16')
    enterValueByAttribute('First name',`${moment().format()}`)
    enterValueByAttribute('Last name', `${moment().format()}`)
    selectValueByAttribute('Gender', 'Female')
    
    cy.get( NewTeiForm.CREATE_BUTTON )
      .click()

    cy.get(EnrollmentDashboard.ENROLLMENT_PAGE)
      .should('be.visible')

  })

  afterEach(() => {
    // delete TEI we just created
    cy.url().then((url) => { 
        let teiId = url.match('(?<=teiId=)(.*)')[0];

        cy.request('DELETE', '/api/trackedEntityInstances/' + teiId)
    })
  })
})