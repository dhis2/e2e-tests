import Page from '../Page'
import { waitForWindowToLoad, waitForVisible } from '#support/wait';

class EventVisualiser extends Page {
  get visualisationList() {
    browser.url('api/eventCharts.json?fields=id,displayName&paging=false' );
    waitForVisible(browser.$('body pre'));
  
    return JSON.parse(browser.$('body pre').getHTML(false))['eventCharts'];
  }

  open() {
    super.open('dhis-web-event-visualizer')
  }

  openFavorite(id) {
    super.open('dhis-web-event-visualizer/?id=' + id);
    waitForWindowToLoad();
  }

  dataExist() {
    return !browser.$('//*[contains(translate(text(), "No", "no"), "no data")]').isExisting();
  }
}

export default EventVisualiser;
export const eventVisualiser = new EventVisualiser();
