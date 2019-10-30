import { getConsoleLog, saveScreenshot } from '@support/action';
import { waitForVisible } from '@support/wait';
import { Given, Then } from 'cucumber';

let listOfFavorites = [];
let appName = '';
let favoritePattern = '/';

Given(/^I have a list of favorites saved in data-visualizer app$/, () => {
  initTestData('charts', 'dhis-web-data-visualizer', '#/');
});

Given(/^I have a list of favorites saved in event-visualizer app$/, () => {
  initTestData('eventCharts', 'dhis-web-event-visualizer', '?id=');
});

Given(/^I have a list of favorites saved in maps app$/, () => {
  initTestData('maps', 'dhis-web-maps', '?id=');
});

Given(/^I have a list of favorites saved in pivot app$/, () => {
  initTestData('reportTables', 'dhis-web-pivot', '?id=');
});

Given(/^I have a list of favorites saved in event reports app$/, () => {
  initTestData('eventReports', 'dhis-web-event-reports', '?id=');
});

function initTestData (dataUrlPart, appNm, appUrlPattern) {
  browser.url('api/' + dataUrlPart + '.json?fields=id,displayName&paging=false');
  waitForVisible(browser.$('body pre'));

  listOfFavorites = JSON.parse(browser.$('body pre').getHTML(false))[dataUrlPart];
  appName = appNm;
  favoritePattern = appUrlPattern;
}

Then(/^every favorite should open without errors$/, { timeout: 1000 * 1000 }, () => {
  let totalConsoleLogs = 0;
  let totalFavoritesWithNoData = 0;
  listOfFavorites.forEach((favorite) => {
    getConsoleLog();
    console.log('Opening favorite ' + favorite.displayName);

    browser.url(appName + '/' + favoritePattern + favorite.id);
    browser.pause(4000);

    const dataExist = !browser.$('//*[contains(translate(text(), "No", "no"), "no data")]').isExisting();
    const consoleLogs = getConsoleLog();

    let reportLog = 'Favorite: \n' + favorite.displayName + ' has following errors: ';

    if (!dataExist) {
      reportLog += '\nNo data exist.';
      totalFavoritesWithNoData += 1;
    }

    reportLog += '\nConsole has ' + consoleLogs.length + ' severe errors: \n' + JSON.stringify(consoleLogs, null, 1);
    totalConsoleLogs += consoleLogs.length;
    const status = consoleLogs.length > 0 || dataExist === false ? 'failed' : 'passed';

    allure.addStep(favorite.displayName, {content: reportLog, name: 'Console errors'}, status);
    if (status === 'failed') {
      saveScreenshot();
    }
  });

  console.log('Total errors ' + (totalConsoleLogs + totalFavoritesWithNoData));
  expect(totalConsoleLogs).to.equal(0, 'Total errors: ' + totalConsoleLogs);
  expect(totalFavoritesWithNoData).to.equal(0, 'Total favorites with no data: ' + totalFavoritesWithNoData);
});
