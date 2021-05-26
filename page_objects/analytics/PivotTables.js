import Page from '../Page'
import { waitForWindowToLoad, waitForVisible } from '#support/wait';

class PivotTables extends Page {
  get visualisationList() {
    browser.url('api/reportTables.json?fields=id,displayName&paging=false' );
    waitForVisible(browser.$('body pre'));
  
    return JSON.parse(browser.$('body pre').getHTML(false))['reportTables'];
  }

  open() {
    super.open('dhis-web-pivot')
  }

  openFavorite(id) {
    super.open('dhis-web-pivot/?id=' + id);
    waitForWindowToLoad();
  }

  dataExist() {
    return !browser.$('//*[contains(translate(text(), "No", "no"), "no data")]').isExisting();
  }

}

export default PivotTables;
export const pivotTables = new PivotTables();
