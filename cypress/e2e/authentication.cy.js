import {
  Selectors as LoginPage,
  setUsername,
  setPassword,
  clickSubmit,
  openLoginPage
} from '../utils/login'

import { 
  getCurrentUser
} from '../utils/api'

import {
  Selectors as HeaderBar
} from '../utils/headerbar'

import {
  openApp
} from '../utils/capture/capture'

describe('Authentication', () => {
  beforeEach(() => {
    openLoginPage()
  })

  it('successfully login', () => {
    setUsername(Cypress.env('LOGIN_USERNAME'))
    setPassword(Cypress.env('LOGIN_PASSWORD'))
    clickSubmit();

    getCurrentUser().then((resp) => {
       expect(resp.username).to.equal(Cypress.env('LOGIN_USERNAME'))
       let initials = resp.firstName.substring(0, 1) + '' + resp.surname.substring(0,1);
       cy.get(HeaderBar.PROFILE_ICON)
          .should('have.text', initials);
    })
  })

  it('fails when password is incorrect', () => {
    setUsername('harooon');
    setPassword('password')
    clickSubmit();

    cy.get(LoginPage.LOGIN_FAILED_MESSAGE)
      .should('contain', 'Wrong username or password');

    cy.get(LoginPage.USERNAME_FIELD)
      .should('be.empty')
    
    cy.get(LoginPage.PASSWORD_FIELD)
      .should('be.empty')

  })
})