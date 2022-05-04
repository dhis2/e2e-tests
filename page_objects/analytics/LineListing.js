import Page from '../Page';
import { waitForVisible, waitForWindowToLoad } from '#support/wait';

class LineListing extends Page {
  constructor() {
    super();
    this.URL = "api/apps/line-listing/index.html"
  };
  
  async open() {
    super.open(this.URL);
  }

  async openLineList(id) {
    super.open(`${this.URL}#/${id}`)
    waitForWindowToLoad();
  }

  get visualizationList() {
    browser.url('api/eventVisualizations.json?fields=id,displayName&paging=false' );
    waitForVisible(browser.$('body pre'));
    return JSON.parse(browser.$('body pre').getHTML(false))['eventVisualizations'];
  }

  dataExist() {
    return !(browser.$('//*[contains(translate(text(), "No", "no"), "no data")]').isExisting());
  }
}

export default LineListing; 
export const lineListing = new LineListing();