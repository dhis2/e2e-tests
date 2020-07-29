import Page from '../Page'

class CaptureCommentsSection extends Page {
  get comments() {
    return browser.$$('[data-test="dhis2-capture-comment"]');
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
}

export default CaptureCommentsSection; 
export const captureCommentsSection = new CaptureCommentsSection();