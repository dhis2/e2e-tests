import Page from '../Page'

class CaptureHeaderBar extends Page {
  get newEventButton() {
    return browser.$('[data-test="dhis2-capture-new-event-button"]');
  }
}

export default CaptureHeaderBar;
export const captureHeaderBar = new CaptureHeaderBar();