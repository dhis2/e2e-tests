export const ANDROID_SETTINGS_APP_URL = "/api/apps/android-settings-app/index.html#";

export const openApp = (path = "") => {
  return cy.visit(`${ANDROID_SETTINGS_APP_URL}${path}`)
}
