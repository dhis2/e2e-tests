import Page from '../Page'
import { waitForWindowToLoad, waitForVisible } from '#support/wait';

class Maps extends Page {
  get visualisationList() {
    browser.url('api/maps.json?fields=id,displayName&paging=false' );
    waitForVisible(browser.$('body pre'));
  
    return JSON.parse(browser.$('body pre').getHTML(false))['maps'];
  }

  get mapsContainerElement() {
    return browser.$('#dhis2-map-container');
  }

  open() {
    super.open('dhis-web-maps')
  }

  openFavorite(id) {
    super.open('dhis-web-maps/?id=' + id);
    waitForWindowToLoad();
  }

  dataExist() {
    return !browser.$('//*[contains(translate(text(), "No", "no"), "no data")]').isExisting();
  }
}

export default Maps;
export const maps = new Maps();
