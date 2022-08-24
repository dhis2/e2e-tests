export const Selectors = {
  USERNAME_FIELD: '#j_username',
  PASSWORD_FIELD: '#j_password',
  SUBMIT_BUTTON: '#submit',
  LOGIN_FAILED_MESSAGE: '#loginMessage'
}

export const openLoginPage= () => {
  cy.visit('/dhis-web-commons/security/login.action')
}
export const setUsername = ( username ) => {
  cy.get(Selectors.USERNAME_FIELD)
    .type(username);
}

export const setPassword = ( password ) => {
  cy.get(Selectors.PASSWORD_FIELD)
    .type(password);
}

export const clickSubmit = () => {
  cy.get(Selectors.SUBMIT_BUTTON)
    .click();
}