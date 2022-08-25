export const Selectors = {
  CREATE_BUTTON: '[data-test="create-and-link-button"]'
}

export const getFormFieldByName = ( name ) => {
  return cy.get('[data-test*=form-field]')
    .filter(`:contains("${name}")`)
}

export const enterValueByAttribute = (attribute, value) => {
  getFormFieldByName(attribute)
    .find('[data-test="capture-ui-input"]')
    .type(value)
}

export const selectValueByAttribute = ( attribute, value ) => {
  getFormFieldByName(attribute)
    .click();

  cy.get('.virtualized-select-option')
    .filter(`:contains("${value}")`)
    .click()
}

export const enterEventDate = ( date) => {
  cy.get('[data-test=dataentry-field-occurredAt]')
    .find('[data-test="capture-ui-input"]')
    .type(`${date}`)
  
  cy.tab()
    .get('[data-test="date-calendar-wrapper"] div')
    .should('not.exist');

}