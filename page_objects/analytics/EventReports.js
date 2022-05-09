import Page from '../Page'
import { waitForWindowToLoad, waitForVisible } from '#support/wait';

class EventReports extends Page {
  get visualizationList() {
    browser.url('api/eventReports.json?fields=id,displayName&paging=false' );
    waitForVisible(browser.$('body pre'));
  
    return JSON.parse(browser.$('body pre').getHTML(false))['eventReports'];
  }

  open() {
    super.open('dhis-web-event-reports')
  }

  openFavorite(id) {
    super.open('dhis-web-event-reports/?id=' + id);
    waitForWindowToLoad();
  }

  dataExist() {
    return !browser.$('//*[contains(translate(text(), "No", "no"), "no data")]').isExisting();
  }
}

export default EventReports;
export const eventReports = new EventReports();
