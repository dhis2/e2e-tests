import Page from './Page';

class Dashboard extends Page {
    get headerDiv() { return browser.element('//*[@id="root"]/div/div[1]') }
    get mainPageDiv() { return browser.element('.dashboard-wrapper') }
    get userIcon() { return browser.element('//*[@id="root"]/div/div[1]/div[3]/div/div[1]') }
    get logoutLink() { return browser.element('a[href$="/dhis-web-commons-security/logout.action"]') }

    open() {
        super.open('dhis-web-dashboard/index.html');
    }

    doLogout() {
        this.open();

        // open the user's menu
        this.userIcon.waitForExist();
        this.userIcon.click();

        this.logoutLink.click();
    }
}

export default Dashboard;
export const dashboardPage = new Dashboard();
