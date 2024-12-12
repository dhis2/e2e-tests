/// <reference types="cypress" />

import { openApp } from "../utils/android";

describe("android", () => {
  beforeEach(() => {
    openApp();
  });
  /*
  it("General Settings", () => {
    openApp("/general-settings");
    // Define an array of input field labels and their expected text values
    const inputFieldAssertions = [
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

    // Loop through each input field assertion and verify the text
    inputFieldAssertions.forEach(({ label, expectedText }) => {
      cy.contains(label)
        .parent()
        .find("input")
        .should("have.value", expectedText);
    });

    //ANDROAPP-3931: Save button is visible and disabled until any changes are made
    // Verify that the save button is disabled
    cy.get(
      '[data-test="dhis2-uicore-buttonstrip"] > :nth-child(1) > [data-test="dhis2-uicore-button"]'
    )
    .should("be.disabled")
    
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
     cy.get(
      '[data-test="dhis2-uicore-buttonstrip"] > :nth-child(1) > [data-test="dhis2-uicore-button"]'
    )
    .should("be.enabled")

    //ANDROAPP-3930: General - Reset all values to default
    // Reset default settings and save the changes
    cy.get('[data-test="dhis2-uicore-buttonstrip"] > :nth-child(2) > [data-test="dhis2-uicore-button"]')
    .click();

        cy.get(
      ':nth-child(6) > [data-test="dhis2-uiwidgets-checkboxfield"] > [data-test="dhis2-uiwidgets-checkboxfield-content"] > [data-test="dhis2-uicore-checkbox"] > .icon'
    ).should("not.be.checked");
     // Verify that the save button is disabled after pressing the reset all values to default button
     cy.get(
      '[data-test="dhis2-uicore-buttonstrip"] > :nth-child(1) > [data-test="dhis2-uicore-button"]'
    )
    .should("be.disabled")

    cy.contains("Reserved values downloaded per TEI attribute")
      .parent()
      .find("input")
      .get('input[type="number"]')
      .last()
      .should("have.value", "100");
  });
*/
  it("Global Settings", () => {
    openApp("/sync/global-settings");

    //ANDROAPP-4964 - Test Labels

    // check if Tracker Import and Export checkboxes are checked
    cy.get(
      '[data-test="dhis2-uiwidgets-checkboxfield"] [data-test="dhis2-uicore-checkbox"] input[type="checkbox"]'
    ).each(($checkbox) => {
      cy.wrap($checkbox).should("be.checked");
    });

    //ANDROAPP-3056: The drop down has 3 options - Last month, Last 3 months and Last 12 months

    //ANDROAPP-3933 - Save button disabled, make a change, save button enabled, click save and changes saved

    //ANDROAPP-3937 - How often should metadata sync

    //ANDROAPP-3938 and 3932 - Reset all values to default
    // Maximum TeI downloads = 500
    // Download TEI that has been updated within = Any time
    // Maximum event downloads = 1000
    // Download TEI that has been updated within = Any time
    // Sync Metadata = 1 day
    // Sync Configuration = 1 day

    //ANDROAPP-3936 - How often should data sync
  });

  it("Synchronization-->Programs", () => {
    openApp("/sync/program-setting");

    //ANDROAPP-3056: Dropdown has three options

    //ANDROAPP-3057: Dropdown has three options

    //ANDROAPP-3059: Under Synchronization - Programs - Global - Setting Level, The different drop downs are Global, Per Org unit, Per Program, Per Org Unit and Program

    //ANDROAPP-3052: Under Synchronization - Programs - Global Download TEI that have been updated within, The different drop downs are Global, Per Org unit, Per Program, Per Org Unit and Program

    //ANDROAPP-3053: Synchronization - Programs - Global - Download TEI with enrollment date within

    //ANDROAPP-3939 - Add a program specific setting --> Values per program --> Download TEI with statuses --> All statuses and Only Active

    //ANDROAPP-3055 - Maximum events to download set to 1000

    //ANDROAPP-3938 - Reset all values to default
    //- Download TEI with status =  All statuses
  });

  it("Synchronization-->Data sets", () => {
    openApp("/sync/dataset-setting");

    //ANDROAPP-3944: Reset all values to default should reset Max number of past data to download to 11
  });

  it("Appearance-->Home Screen", () => {
    openApp("/appearance/home-screen");
    //check Date, Org Unit, Sync Status and Assigned to Me checkboxes are checked
    cy.get(
      '[data-test="dhis2-uiwidgets-checkboxfield"] [data-test="dhis2-uicore-checkbox"] input[type="checkbox"]'
    ).each(($checkbox) => {
      cy.wrap($checkbox).should("be.checked");
    });
  });

  it("Appearance-->Program", () => {
    openApp("/appearance/program");

    //ANDROAPP-3951: Appearance - Program - Global - Save button
    cy.get(
      '[data-test="sidebar-link-dataset-appearance"] > a.jsx-2002348738 > .jsx-2002348738'
    ).click();
    cy.get(
      '.Button_container__padding__emSUv > :nth-child(1) > [data-test="dhis2-uicore-button"]'
    ).should("be.disabled");
  });

  it("Appearance-->Datasets", () => {
    openApp("/appearance/dataset");

    //ANDROAPP-3943: Save button is visible and disabled until any changes are made
    // Verify that the save button is disabled
    cy.contains("Save").should("be.disabled"); // Check that it has type="button"

    /*
    // ANDROAPP-3957: Appearance - Data Set - Reset all values
    cy.get(':nth-child(3) > :nth-child(2) > .Field_row__429F9 > [data-test="dhis2-uiwidgets-checkboxfield"] > [data-test="dhis2-uiwidgets-checkboxfield-content"] > [data-test="dhis2-uicore-checkbox"] > .icon')
      .should('be.checked')
    cy.get(':nth-child(5) > :nth-child(2) > .Field_row__429F9 > [data-test="dhis2-uiwidgets-checkboxfield"] > [data-test="dhis2-uiwidgets-checkboxfield-content"] > [data-test="dhis2-uicore-checkbox"] > input.jsx-4249355495')
      .should('be.checked')
    cy.get(':nth-child(7) > :nth-child(2) > .Field_row__429F9 > [data-test="dhis2-uiwidgets-checkboxfield"] > [data-test="dhis2-uiwidgets-checkboxfield-content"] > [data-test="dhis2-uicore-checkbox"] > input.jsx-4249355495')
      .should('be.checked') */

    //ANDROAPP-3943: Save button is visible and disabled until any changes are made
    // Verify that the save button is disabled

    cy.contains("Save").should("be.enabled"); // Check that it has type="button"
  });

  /*

    //Start of Global settings


// Max Filesize is blank
cy.contains("label", "Maximum file size limit for download (Kb)")
.parent() // Navigate to the parent container of the label
.within(() => {
  // Assert that the element with data-test="dhis2-uicore-box" is blank
  cy.get('[data-test="dhis2-uicore-box"]').should("have.text", "");
}); 
    
*/
});
