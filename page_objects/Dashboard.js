import Page from './Page';

class Dashboard extends Page {
  get headerDiv () { return browser.element('//*[@id="root"]/div/div[1]'); }
  get mainPageDiv () { return browser.element('.dashboard-wrapper'); }
  get userIcon () { return browser.element('[class*="profile"]'); }
  get logoutLink () { return browser.element('[class*="profile"] [class*="contents"] li:last-child div'); }
  get filtersArea () { return browser.element('.d2-ui-control-bar-contents'); }
  get filters () {
    // @todo address  chained selectors with wdio 5. https://github.com/webdriverio/webdriverio/issues/2571
    browser.waitForExist(this.filtersArea.selector + ' a');
    browser.waitForExist(this.filtersArea.elements('a').selector);
    return browser.elements(this.filtersArea.selector + ' a').value.reduce((reduced, filter) => {
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
    this.userIcon.waitForExist();
    this.userIcon.click();

    this.logoutLink.click();
  }
}

export default Dashboard;
export const dashboardPage = new Dashboard();
