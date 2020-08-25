import Page from '../Page'

class CaptureCommentsSection extends Page {
  get comments() {
    return browser.$$('[data-test="dhis2-capture-comment"]');
  }

  get commentsListElement() {
    return browser.$('[data-test="dhis2-capture-comments-list"]');
  }

  get newCommentButton() {
    return browser.$('[data-test="dhis2-capture-new-comment-button"]');
  }

  get newCommentTextField() {
    return browser.$('[data-test="dhis2-capture-comment-textfield"]');
  }

  get saveCommentButton() {
    return browser.$('[data-test="dhis2-capture-comment-buttons-container"] button:first-of-type');
  }

  commentByValue(val) {
    return this.commentsListElement.$(`//li[//p[.="${val}"]]`);
  }
}

export default CaptureCommentsSection; 
export const captureCommentsSection = new CaptureCommentsSection();