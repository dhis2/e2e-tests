import Page from '../Page'
import { waitForWindowToLoad } from '@support/wait'
import CaptureCommentsSection from './CaptureCommentsSection';

class CaptureNewEventForm extends Page {
  get dateFields() {
    return browser.$$('[data-test="capture-ui-input"][placeholder="yyyy-mm-dd"]')
  }; 

  get selectFields() {
    return browser.$$('[class*=Select-control]');
  }

  get textFields() {
    return browser.$$('[class*="textFieldCustomForm"] [data-test="capture-ui-input"]');
  }

  get mainSaveButton() {
    return browser.$('[data-test="dhis2-capture-main-button"]');
  }

  get commentsSection() {
    return new CaptureCommentsSection();
  }

  fill() {
    this.dateFields.forEach(dateField => {
      dateField.setValue('2019-10-04');
      browser.keys(['Tab']);
    });

    this.selectFields.forEach((selectField) => {
      selectField.click();
      browser.$('.Select-menu-outer:last-child').click();
    })

    this.textFields.forEach((textField) => {
      textField.setValue(33);
    })
  }

  fillAndSave() {
    this.fill();
    this.mainSaveButton.click(); 
    waitForWindowToLoad();
  }
}

export default CaptureNewEventForm;
export const captureNewEventForm = new CaptureNewEventForm();