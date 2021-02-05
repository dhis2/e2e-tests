import Page from '../Page'
import { waitForWindowToLoad } from '@support/wait'

class CaptureIndexPage extends Page {
  get orgUnits() {
    return browser.$('.orgunit');
  }

  get eventsTable() {
    return browser.$('[data-test="online-list-table"]');
  }
  
  get tableRows() {
    return browser.$$('[data-test="online-list-table"] tbody [data-test="table-row"]')
  }

  get tableRowCount() {
    return this.tableRows.length;
  }

  get ouSearch() {
    return browser.$('[data-test="org-unit-selector-container"] [data-test="capture-ui-input"]')
  }

  get deleteEventButton() {
    return browser.$('[data-test="delete-event-button"]');
  }

  open() {
    super.open('dhis-web-capture');
    waitForWindowToLoad();
  }

  selectProgram(name) {
    browser.$('#program-selector .Select-placeholder').click();
    browser.$('.Select-menu-outer').$('//*[contains(text(), "' + name + '")]').click();

    waitForWindowToLoad();
  }

  selectOrgUnitByName(name) {
    this.ouSearch.setValue(name);
    browser.$('//*[contains(text(), "' + name + '")]').click();
  }
}

export default CaptureIndexPage;
export const captureIndexPage = new CaptureIndexPage();