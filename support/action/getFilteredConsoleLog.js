import getConsoleLog from './getConsoleLog'

module.exports = () => {
  return getConsoleLog().filter((value) => {
    const message = value['message'];

    // excluding errors that are either known issues or expected under certain db states
    return !(message.includes('status of 404') &&
      (message.includes('userDataStore/') ||
      message.includes('staticContent/logo_banner') || //https://jira.dhis2.org/browse/DHIS2-7656
      message.includes('userSettings.json?'))) && 
      !message.includes('MIME type') &&
      !message.includes("manifest.json") && 
      !message.includes('Failed to fetch')  &&
      !message.includes('cacheManifest.action') && 
      !message.includes('i18nJavaScript.action') &&
      !message.includes('useNewDashboard') &&
      !message.includes('files/script') // https://jira.dhis2.org/browse/DHIS2-8864
    });
}
