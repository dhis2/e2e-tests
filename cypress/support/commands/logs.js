const excludedErrors = [
  'status of 404', 'userDataStore/', 'staticContent/logo_banner', 
  'userSettings.json?', 'MIME type', "manifest.json", 
  'Failed to fetch', 'cacheManifest.action', 
  'i18nJavaScript.action', 'files/script'
];

Cypress.Commands.add('getConsoleLogs', () => {
  cy.task('console:logs').then((logs) => {
    return logs.filter((log) => {
      return !excludedErrors.some((excl) => {
        return log.text.includes(excl)
      })
    });
  })
})

Cypress.Commands.add('clearConsoleLogs', () => {
  cy.task('console:clear');
})

