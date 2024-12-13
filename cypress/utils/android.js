export const ANDROID_SETTINGS_APP_URL =
  "/api/apps/android-settings-app/index.html#";

export const openApp = (path = "") => {
  return cy.visit(`${ANDROID_SETTINGS_APP_URL}${path}`);
};

export const Selectors = {
  SAVE_AND_RESET_ALL_VALUES_BUTTON_SELECTOR:
    '[data-test="dhis2-uicore-buttonstrip"] [data-test="dhis2-uicore-button"]',
  NEW_VERSION_OF_TRACKER_CHECKBOX_SELECTOR: '[data-test="dhis2-uiwidgets-checkboxfield"]',
  CHECKBOX_SELECTOR: '[data-test="dhis2-uicore-checkbox"]',
  SINGLESELECTOPTION_SELECTOR: '[data-test="dhis2-uicore-singleselectoption"]',
  UICORE_SELECT_INPUT_SELECTOR: '[data-test="dhis2-uicore-select-input"]',
  UICORE_INPUT_SELECTOR: '[data-test="dhis2-uicore-input"]',
};

export const inputFieldAssertions = [
  //ANDROAPP-3044: General-SMS Gateway - Blank
  { label: "SMS Gateway phone number", expectedText: "" },
  //ANDROAPP-3046: SMS Result Sender phone number
  { label: "SMS Result Sender phone number", expectedText: "" },
  //ANDROAPP-3049: General-Reserved Values - Greater than zero
  {
    label: "Reserved values downloaded per TEI attribute",
    expectedText: "100",
  },
];
export const syncGlobal = [
  ["1 Day", "1 Week", "Manual"], // Options for the first element
  ["30 Minutes", "1 Hour", "6 Hours", "12 Hours", "1 Day", "Manual"], // Options for the second element
];

export const dropdownValues = [
  ["Global", "Per Org Unit", "Per program", "Per OU and program"], 
  ["Any time period", "Last month", "Last 3 months", "Last 12 months"], 
  ["Any time period", "Last month", "Last 3 months", "Last 12 months"], 
];
