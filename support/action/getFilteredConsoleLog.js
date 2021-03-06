import getConsoleLog from './getConsoleLog'

module.exports = () => {
  return getConsoleLog().filter((value) => {
    const message = value['message'];

    // excluding possible errors that is not considered as errors, but rather as backend functionality
    return !(message.includes('status of 404') &&
      (message.includes('userDataStore/') ||
      message.includes('staticContent/logo_banner') || //https://jira.dhis2.org/browse/DHIS2-7656
      message.includes('userSettings.json?'))) && 
      !message.includes('MIME type') && 
      !message.includes("Cannot read property 'formatDate' of undefined") &&
      !message.includes("manifest.json") && 
      !message.includes('Failed to fetch')  &&
      !message.includes('cacheManifest.action') && 
      !message.includes('i18nJavaScript.action') &&
      !message.includes('files/script') // https://jira.dhis2.org/browse/DHIS2-8864
    });
}