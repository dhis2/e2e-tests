/// <reference types="cypress" />

import {
  openApp,
  Selectors,
  dropdownValues,
  inputFieldAssertions,
  syncGlobal,
} from "../utils/android";

describe("android", () => {
  beforeEach(() => {
    openApp();
  });

      it("General Settings", () => {
    openApp("/general-settings");
  
    // Loop through each input field assertion and verify the text
    inputFieldAssertions.forEach(({ label, expectedText }) => {
      cy.contains(label)
        .parent()
        .find("input")
        .should("have.value", expectedText);
    });

    //ANDROAPP-3931: Save button is visible and disabled until any changes are made
    // Verify that the save button is disabled
    cy.get(Selectors.SAVE_AND_RESET_ALL_VALUES_BUTTON_SELECTOR)
      .contains("Save") // Ensure the button has the correct text
      .should("be.disabled");

    //ANDROAPP-3048: General-Reserved Values - cannot enter negative number
    cy.contains("Reserved values downloaded per TEI attribute")
      .parent()
      .find("input")
      .get('input[type="number"]')
      .last()
      .clear()
      .type("-20")
      .should("have.value", "20");

    // Verify that the save button is enabled
    cy.get(Selectors.SAVE_AND_RESET_ALL_VALUES_BUTTON_SELECTOR)
      .contains("Save") // Ensure the button has the correct text
      .should("be.enabled");

    //ANDROAPP-3930: General - Reset all values to default
    // Reset default settings and save the changes
    cy.get(Selectors.SAVE_AND_RESET_ALL_VALUES_BUTTON_SELECTOR)
      .contains("Reset all values to default") // Ensure the button has the correct text
      .click();

    // Verify that the save button is disabled after pressing the reset all values to default button
    cy.get(Selectors.SAVE_AND_RESET_ALL_VALUES_BUTTON_SELECTOR)
      .contains("Save") // Ensure the button has the correct text
      .should("be.disabled");

    cy.contains("Reserved values downloaded per TEI attribute")
      .parent()
      .find("input")
      .get('input[type="number"]')
      .last()
      .should("have.value", "100");
  });


  it("Synchronization-->Global", () => {
    openApp("/sync/global-settings");

    //ANDROAPP-3933 - Save button disabled, make a change, save button enabled, click save and changes saved
    // Verify that the save button is disabled
    cy.get(Selectors.SAVE_AND_RESET_ALL_VALUES_BUTTON_SELECTOR)
      .contains("Save") // Ensure the button has the correct text
      .should("be.disabled");

    //ANDROAPP-3936 and 3937 - How often should metadata and data sync
    cy.get(Selectors.UICORE_SELECT_INPUT_SELECTOR).each(($el, index) => {
      // Click on each element one by one
      cy.wrap($el).click();

      cy.get(Selectors.SINGLESELECTOPTION_SELECTOR)
        .should("have.length", syncGlobal[index].length) // Ensure correct number of options
        .each(($dropdown, dropdownIndex) => {
          cy.wrap($dropdown).should(
            "have.text",
            syncGlobal[index][dropdownIndex]
          );
        });

      cy.get("body").click(); // Click to close dropdowns
    });

    // ANDROAPP-4964 - Test Labels and check if checkboxes are checked
    cy.get(Selectors.NEW_VERSION_OF_TRACKER_CHECKBOX_SELECTOR).each(
      ($checkboxField) => {
        const $checkbox = $checkboxField.find('input[type="checkbox"]');
        const $label = $checkboxField.find("label");

        // Assert checkbox is checked
        cy.wrap($checkbox).should("be.checked");

        // Assert label contains specific text
        cy.wrap($label).should(($labelText) => {
          const labelText = $labelText.text().trim();
          expect([
            "Use the new version of Tracker Importer (Web API)",
            "Use the new version of Tracker Exporter (Web API)",
          ]).to.include(labelText);
        });
      }
    );

    // Max Filesize is blank
    cy.contains("label", "Maximum file size limit for download (Kb)")
      .parent() // Navigate to the parent container of the label
      .within(() => {
        // Assert that the element with data-test="dhis2-uicore-box" is blank
        cy.get('[data-test="dhis2-uicore-box"]').should("have.text", "");
      });

    //ANDROAPP-3933 continued - Save button disabled, make a change, save button enabled, click save and changes saved
    cy.get(Selectors.SAVE_AND_RESET_ALL_VALUES_BUTTON_SELECTOR)
      .contains("Reset all values to default") // Ensure the button has the correct text
      .click(); // Click the button

    cy.get(Selectors.SAVE_AND_RESET_ALL_VALUES_BUTTON_SELECTOR)
      .contains("Save") // Ensure the button has the correct text
      .should("be.disabled");
  });

  it("Synchronization-->Programs", () => {
    openApp("/sync/program-setting");

    //ANDROAPP-3056, 3057, 3052 and 3059: Dropdown has three options

    // Find all elements with the same data-test attribute
    cy.get(Selectors.UICORE_SELECT_INPUT_SELECTOR).each(($el, index) => {
      // Click on each element one by one
      cy.wrap($el).click();

      cy.get(Selectors.SINGLESELECTOPTION_SELECTOR)
        .should("have.length", dropdownValues[index].length) // Ensure correct number of options
        .each(($dropdown, dropdownIndex) => {
          cy.wrap($dropdown).should(
            "have.text",
            dropdownValues[index][dropdownIndex]
          );
        });

      cy.get("body").click(); // Click to close dropdowns
    });

    //ANDROAPP-3939 - Add a program specific setting --> Values per program --> Download TEI with statuses --> All statuses and Only Active

    //ANDROAPP-3938 and 3932 - Reset all values to default
    // Maximum TeI downloads = 500
    // Download TEI that has been updated within = Any time Period
    // Maximum event downloads = 1000
    // Download TEI that has been updated within = Any time Period

    cy.get(Selectors.SAVE_AND_RESET_ALL_VALUES_BUTTON_SELECTOR)
      .contains("Reset all values to default") // Ensure the button has the correct text
      .click(); // Click the button

    //ANDROAPP-3055 - Maximum events to download set to 1000

    cy.get(Selectors.UICORE_INPUT_SELECTOR)
      .find("#teiDownload")
      .should("have.value", "500");

    cy.get(Selectors.UICORE_INPUT_SELECTOR)
      .find("#eventsDownload")
      .should("have.value", "1000");

    cy.get(Selectors.UICORE_SELECT_INPUT_SELECTOR).eq(0).contains("Global");

    cy.get(Selectors.UICORE_SELECT_INPUT_SELECTOR)
      .eq(1)
      .contains("Any time period");

    // Get the second element and check if it contains "Any time period"
    cy.get(Selectors.UICORE_SELECT_INPUT_SELECTOR)
      .eq(2)
      .contains("Any time period");
  });

  it("Synchronization-->Data sets", () => {
    openApp("/sync/dataset-setting");

    //ANDROAPP-3944: Reset all values to default should reset Max number of past data to download to 11
    // Verify that the save button is disabled
    cy.get(Selectors.SAVE_AND_RESET_ALL_VALUES_BUTTON_SELECTOR)
      .contains("Save") // Ensure the button has the correct text
      .should("be.disabled");

    cy.get(Selectors.SAVE_AND_RESET_ALL_VALUES_BUTTON_SELECTOR)
      .contains("Reset all values to default") // Ensure the button has the correct text
      .click(); // Click the button

    cy.get("#periodDSDownload").should("have.value", "11");

    cy.get(Selectors.SAVE_AND_RESET_ALL_VALUES_BUTTON_SELECTOR)
      .contains("Save") // Ensure the button has the correct text
      .should("be.disabled");
  });

  it("Appearance-->Home Screen", () => {
    openApp("/appearance/home-screen");

    // ANDROAPP-3946: Appearance - Home Screen- Reset all values
    // Verify that the save button is disabled
    cy.get(Selectors.SAVE_AND_RESET_ALL_VALUES_BUTTON_SELECTOR)
      .contains("Save") // Ensure the button has the correct text
      .should("be.disabled");

    cy.get(Selectors.SAVE_AND_RESET_ALL_VALUES_BUTTON_SELECTOR)
      .contains("Reset all values to default") // Ensure the button has the correct text
      .click(); // Click the button

    //ANDROAPP-3945: check Date, Org Unit, Sync Status and Assigned to Me checkboxes are checked
    cy.get(Selectors.CHECKBOX_SELECTOR).each(($checkbox) => {
      // Check if the element is of type checkbox
      cy.wrap($checkbox)
        // Get the name attribute of the checkbox
        .and(($el) => {
          const name = $el.attr("name");

          // Check if the name is one of the specified values
          if (
            ["date", "organisationUnit", "syncStatus", "assignedToMe"].includes(
              name
            )
          ) {
            // Verify the checkbox is checked
            cy.wrap($checkbox).should("be.checked");
          }
        });
    });

    cy.get(Selectors.SAVE_AND_RESET_ALL_VALUES_BUTTON_SELECTOR)
      .contains("Save") // Ensure the button has the correct text
      .should("be.disabled");
  });

  it("Appearance-->Program", () => {
    openApp("/appearance/program");

    //ANDROAPP-3950: Appearance - Program - Global - Save button

    // Verify that the save button is disabled
    cy.get(Selectors.SAVE_AND_RESET_ALL_VALUES_BUTTON_SELECTOR)
      .contains("Save") // Ensure the button has the correct text
      .should("be.disabled");

    cy.get(Selectors.SAVE_AND_RESET_ALL_VALUES_BUTTON_SELECTOR)
      .contains("Reset all values to default") // Ensure the button has the correct text
      .click(); // Click the button

    cy.get(Selectors.CHECKBOX_SELECTOR).each(($checkbox) => {
      // Check if the element is of type checkbox
      cy.wrap($checkbox)
        // Get the name attribute of the checkbox
        .and(($el) => {
          const name = $el.attr("name");

          // Check if the name is one of the specified values
          if (
            [
              "assignedToMe",
              "enrollmentDate",
              "enrollmentStatus",
              "eventDate",
              "eventStatus",
              "organisationUnit",
              "syncStatus",
              "followUp",
            ].includes(name)
          ) {
            // Verify the checkbox is checked
            cy.wrap($checkbox).should("be.checked");
          }
        });
    });

    cy.get(Selectors.SAVE_AND_RESET_ALL_VALUES_BUTTON_SELECTOR)
      .contains("Save") // Ensure the button has the correct text
      .should("be.enabled");
  });

  it("Appearance-->Datasets", () => {
    openApp("/appearance/dataset");

    //ANDROAPP-3943: Save button is visible and disabled until any changes are made
    // Verify that the save button is disabled
    cy.get(Selectors.SAVE_AND_RESET_ALL_VALUES_BUTTON_SELECTOR)
      .contains("Save") // Ensure the button has the correct text
      .should("be.disabled");

    // ANDROAPP-2959: Add a specific setting

    // ANDROAPP-3957: Appearance - Data Set - Reset all values
    cy.get(Selectors.SAVE_AND_RESET_ALL_VALUES_BUTTON_SELECTOR)
      .contains("Reset all values to default") // Ensure the button has the correct text
      .click(); // Click the button

    cy.get(Selectors.CHECKBOX_SELECTOR).each(($checkbox) => {
      // Check if the element is of type checkbox
      cy.wrap($checkbox)
        // Get the name attribute of the checkbox
        .and(($el) => {
          const name = $el.attr("name");

          // Check if the name is one of the specified values
          if (["organisationUnit", "period", "syncStatus"].includes(name)) {
            // Verify the checkbox is checked
            cy.wrap($checkbox).should("be.checked");
          }
        });
    });

    // Verify that the save button is disabled
    cy.get(Selectors.SAVE_AND_RESET_ALL_VALUES_BUTTON_SELECTOR)
      .contains("Save") // Ensure the button has the correct text
      .should("be.disabled");
  });
});
