import Page from './Page'
import { waitForVisible } from '#support/wait';

class AppsList extends Page {
  get apps() {
    return browser.$$('a');
  }

  get table() {
    return browser.$('table');
  }
  
  open () {
    super.open('dhis-web-apps');

    waitForVisible(this.table);
  }


}


export default AppsList;
export const appsList = new AppsList();