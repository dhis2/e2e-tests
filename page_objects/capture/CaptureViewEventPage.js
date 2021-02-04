import Page from '../Page'
import { waitForWindowToLoad} from '@support/wait';
class CaptureViewEventPage extends Page {
  open(eventId) {
    super.open('dhis-web-capture/#/viewEvent?viewEventId=' + eventId);
    waitForWindowToLoad();
  }

}

export default CaptureViewEventPage;
export const captureViewEventPage = new CaptureViewEventPage();