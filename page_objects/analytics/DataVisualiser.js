import Page from '../Page'
import { waitForWindowToLoad, waitForVisible } from '#support/wait';

class DataVisualiser extends Page {
  get visualisationList() {
    browser.url('api/visualizations.json?fields=id,displayName&paging=false' );
    waitForVisible(browser.$('body pre'));
  
    return JSON.parse(browser.$('body pre').getHTML(false))['visualizations'];
  }

  get gettingStartedElement() {
    return browser.$('[data-test="start-screen-primary-section-title"]');
  }

  open() {
    super.open('dhis-web-data-visualizer')
  }

  openFavorite(id) {
    super.open('dhis-web-data-visualizer/#/' + id);
    waitForWindowToLoad();
  }

  dataExist() {
    return !browser.$('//*[contains(translate(text(), "No", "no"), "no data")]').isExisting();
  }

}

export default DataVisualiser;
export const dataVisualiser = new DataVisualiser();
