import moment from 'moment';

export const Selectors = {
  NEW_COMMENT_BUTTON: '[data-test="new-comment-button"]', 
  COMMENT_TEXT_FIELD: '[data-test="comment-textfield"]',
  COMMENTS_LIST: '[data-test="comments-list"]',
  NEW_EVENT_FORM: '[data-test="registration-page-content"]'
}


export const getCommentByValue = ( value ) => {
  return cy.get(Selectors.COMMENTS_LIST)
    .contains(value);
}

export const addComment = ( comment ) => {
  cy.get(Selectors.NEW_COMMENT_BUTTON)
    .click();

  cy.get(Selectors.COMMENT_TEXT_FIELD)
    .type(comment);

  cy.get('[data-test="comment-buttons-container"] button').first().click();
}


export const fillEventForm = () => {
  cy.get( Selectors.NEW_EVENT_FORM ).should('be.visible');

  //todo fix this. Calendar picker sometimes stays open. 
  cy.get('[data-test="capture-ui-input"][placeholder="yyyy-mm-dd"]')
    .each(($el) => {
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

  cy.get('[class*="textInput"] [data-test="capture-ui-input"]')
    .each(($el) => {
      cy.wrap($el)
      .type('33');
    });
}