import Page from '../Page'
import { waitForWindowToLoad } from '#support/wait'

class CaptureHeaderBar extends Page {
  get newEventButton() {
    return browser.$('[data-test="new-button"]');
  }

  openNewEventFormInProgram() {
    this.newEventButton.click();
    browser.$('[data-test="new-menuitem-one"] a').click();

    waitForWindowToLoad();
  }
}

export default CaptureHeaderBar;
export const captureHeaderBar = new CaptureHeaderBar();