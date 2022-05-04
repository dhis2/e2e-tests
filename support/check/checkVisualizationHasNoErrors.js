import { getFilteredConsoleLog } from '#support/action';

module.exports = (visualizationName, dataExist) => {
  const consoleLogs = getFilteredConsoleLog();

  let reportLog = 'Favorite: \n' + visualizationName + ' has following errors: ';

  if (!dataExist) {
    reportLog += '\nNo data exist.';
  }

  reportLog += '\nConsole has ' + consoleLogs.length + ' severe errors: \n' + JSON.stringify(consoleLogs, null, 1);

  expect(dataExist, 'No data exists').to.equal(true);
  expect(consoleLogs.length, reportLog).to.equal(0)
}