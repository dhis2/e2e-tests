import Page from '../Page'

class CaptureHeaderBar extends Page {
  get newEventButton() {
    return browser.$('[data-test="new-event-button"]');
  }
}

export default CaptureHeaderBar;
export const captureHeaderBar = new CaptureHeaderBar();