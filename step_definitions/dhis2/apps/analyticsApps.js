import { getFilteredConsoleLog, getConsoleLog, saveScreenshot } from '@support/action';
import { waitForVisible } from '@support/wait';
import { Given, Then } from 'cucumber';
import { reportStep } from '@support/reporting'

let listOfFavorites = [];
let appName = '';
let favoritePattern = '/';

Given(/^I have a list of favorites saved in data-visualizer app$/, () => {
  initTestData('charts', '.json?fields=id,displayName&paging=false', 'dhis-web-data-visualizer', '#/');
});

Given(/^I have a list of pivot tables saved in data-visualizer app$/, () => {
  initTestData('visualizations','.json?filter=type:eq:PIVOT_TABLE&fields=id,displayName&paging=false','dhis-web-data-visualizer', '#/');
});

Given(/^I have a list of favorites saved in event-visualizer app$/, () => {
  initTestData('eventCharts','.json?fields=id,displayName&paging=false', 'dhis-web-event-visualizer', '?id=');
});

Given(/^I have a list of favorites saved in maps app$/, () => {
  initTestData('maps','.json?fields=id,displayName&paging=false', 'dhis-web-maps', '?id=');
});

Given(/^I have a list of favorites saved in pivot app$/, () => {
  initTestData('reportTables','.json?fields=id,displayName&paging=false', 'dhis-web-pivot', '?id=');
});

Given(/^I have a list of favorites saved in event reports app$/, () => {
  initTestData('eventReports','.json?fields=id,displayName&paging=false','dhis-web-event-reports', '?id=');
});

function initTestData (dataUrlPart, queryParams, appNm, appUrlPattern) {
  browser.url('api/' + dataUrlPart + queryParams);
  waitForVisible(browser.$('body pre'));

  listOfFavorites = JSON.parse(browser.$('body pre').getHTML(false))[dataUrlPart];
  appName = appNm;
  favoritePattern = appUrlPattern;
}

Then(/^every favorite should open without errors$/, { timeout: 1000 * 10000 }, () => {
  let totalConsoleLogs = 0;
  let totalFavoritesWithNoData = 0;
  listOfFavorites.forEach((favorite) => {
    getConsoleLog();
    console.log('Opening favorite ' + favorite.displayName);

    browser.url(appName + '/' + favoritePattern + favorite.id);
    browser.pause(4000);

    const dataExist = !browser.$('//*[contains(translate(text(), "No", "no"), "no data")]').isExisting();
    const consoleLogs = getFilteredConsoleLog();

    let reportLog = 'Favorite: \n' + favorite.displayName + ' has following errors: ';

    if (!dataExist) {
      reportLog += '\nNo data exist.';
      totalFavoritesWithNoData += 1;
    }

    reportLog += '\nConsole has ' + consoleLogs.length + ' severe errors: \n' + JSON.stringify(consoleLogs, null, 1);
    totalConsoleLogs += consoleLogs.length;
    const status = consoleLogs.length > 0 || dataExist === false ? 'failed' : 'passed';

    // due to the test being dynamic, these has to be done here instead of using hooks. 
    reportStep(`I open ${favorite.displayName}`, 'There should be no console errors', status , reportLog);
  });

  console.log('Total errors ' + (totalConsoleLogs + totalFavoritesWithNoData));
  expect(totalConsoleLogs).to.equal(0, 'Total errors: ' + totalConsoleLogs);
  expect(totalFavoritesWithNoData).to.equal(0, 'Total favorites with no data: ' + totalFavoritesWithNoData);
});
