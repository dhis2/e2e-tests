import Page from './Page';
import { waitForElementToExist, waitForVisible } from '@support/wait';

class Dashboard extends Page {
  get headerDiv () { return browser.$('//*[@id="root"]/div/div[1]'); }
  get mainPageDiv () { return browser.$('.dashboard-wrapper'); }
  get userIcon () { return browser.$('[class*="profile"]'); }
  get logoutLink () { return browser.$('[class*="profile"] [class*="contents"] li:last-child div'); }
  get filtersArea () { return browser.$('[class*="ControlBar_content"]'); }
  get filters () {
    waitForVisible(this.filtersArea);
    const filters = this.filtersArea.$$('a');
   
    return filters.reduce((reduced, filter) => {
      const href = filter.getAttribute('href');
      if (!href.includes('new')) {
        reduced.push(filter);
      }
      return reduced;
    }, []);
  }

  open () {
    super.open('dhis-web-dashboard/index.html');
  }

  doLogout () {
    this.open();

    // open the user's menu
    waitForElementToExist(this.userIcon);
    this.userIcon.click();

    this.logoutLink.click();
  }
}

export default Dashboard;
export const dashboardPage = new Dashboard();
