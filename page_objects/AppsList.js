import Page from './Page'
import { waitForVisible } from '#support/wait';

class AppsList extends Page {
  get apps() {
    return browser.$$('a');
  }

  get table() {
    return browser.$('table');
  }

  get list() {
    const appList = ['dhis-web-dataentry/index.action'];
    this.apps.map(app => {
      if (app.getText() === 'log out' || app.getText() === 'dhis-web-core-resource' || app.getText() === 'Apps Bundle JSON') return;
      appList.push(app.getText());
    });

    return appList;
  }
  
  open () {
    super.open('dhis-web-apps');

    waitForVisible(this.table);
  }
}

export default AppsList;
export const appsList = new AppsList();
