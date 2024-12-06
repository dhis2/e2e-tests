describe("android", () => {
  it("should perform the manual steps", () => {
    // Visit a URL
    cy.visit("/api/apps/android-settings-app/index.html#/");

    // Navigate to General Settings
    cy.get('[data-test="sidebar-link-general-settings"]').click();

    // Define an array of input field labels and their expected text values
    const inputFieldAssertions = [
      //ANDROAPP-3044: General-SMS Gateway - Blank
      { label: "SMS Gateway phone number", expectedText: "" },
      //ANDROAPP-3046: SMS Result Sender phone number
      { label: "SMS Result Sender phone number", expectedText: "" },
      //ANDROAPP-3049: General-Reserved Values - Greater than zero
      { label: "Reserved values downloaded per TEI attribute", expectedText: "100" },    
    ];
    
    // Loop through each input field assertion and verify the text
    inputFieldAssertions.forEach(({ label, expectedText }) => {

      cy.contains(label)
        .parent()
        .find('input')
        .should('have.value',expectedText)
    });

    //ANDROAPP-3931: Save button is visible and disabled until any changes are made
    // Verify that the save button is disabled
    cy.get('[data-test="dhis2-uicore-buttonstrip"] > :nth-child(1) > [data-test="dhis2-uicore-button"]')      
      .should("be.disabled");

    //ANDROAPP-3930: General - Reset all values to default
    // Reset default settings and save the changes
    cy.get(':nth-child(2) > [data-test="dhis2-uicore-button"]').click()
    cy.get('[data-test="dhis2-uicore-buttonstrip"] > :nth-child(1) > [data-test="dhis2-uicore-button"]')      
      .should("be.enabled");


    // Navigate to Global Settings
    cy.get(
      '[data-test="sidebar-link-dataset-appearance"]'
    ).click();

    //ANDROAPP-3945: Save button is visible and disabled until any changes are made
    // Verify that the button is disabled
    cy.get(
      '.Button_container__padding__emSUv > :nth-child(1) > [data-test="dhis2-uicore-button"]'
    ).should("be.disabled");

    //ANDROAPP-3951: Appearance - Program - Global - Save button
    cy.get('[data-test="sidebar-link-dataset-appearance"] > a.jsx-2002348738 > .jsx-2002348738').click();
    cy.get('.Button_container__padding__emSUv > :nth-child(1) > [data-test="dhis2-uicore-button"]').should("be.disabled");

//Test code

    // Interact with elements
    //      cy.get('[data-test="element-selector"]').click();
    //      cy.get('[data-test="input-selector"]').type("Test data");

    cy.get('[data-test="sidebar-link-global-settings"]').click();

    // check if Tracker Import and Export checkboxes are checked
    cy.get(
      '[data-test="dhis2-uiwidgets-checkboxfield"] [data-test="dhis2-uicore-checkbox"] input[type="checkbox"]'
    ).each(($checkbox) => {
      cy.wrap($checkbox).should("be.checked");
    });

    // Max Filesize is blank
    cy.contains("label", "Maximum file size limit for download (Kb)")
      .parent() // Navigate to the parent container of the label
      .within(() => {
        // Assert that the element with data-test="dhis2-uicore-box" is blank
        cy.get('[data-test="dhis2-uicore-box"]').should("have.text", "");
      });

    // Appearance Menu
    // home screen
    cy.get('[data-test="sidebar-link-home-screen-appearance"]').click();
    cy.url().should("contain", "home-screen");

    //check Date, Org Unit, Sync Status and Assigned to Me checkboxes are checked
    cy.get(
      '[data-test="dhis2-uiwidgets-checkboxfield"] [data-test="dhis2-uicore-checkbox"] input[type="checkbox"]'
    ).each(($checkbox) => {
      cy.wrap($checkbox).should("be.checked");
    });

    // Find the dropdown with the label "How often should metadata sync?"

    //cy.get('[data-test="output-selector"]').should("contain", "How often should metadata sync?");
    //    cy.contains("How often should metadata sync?");

    /*cy.contains('label', 'How often should metadata sync?')
  .parent() // Navigate to the parent container of the label
  .within(() => {
    // Open the dropdown
    cy.get('[data-test="dhis2-uicore-select-input"]').click();
    //cy.get('[data-test="dhis2-uicore-select-menu-menuwrapper"]').should('be.visible')
    cy.contains('1 Day').should('exist');

    //cy.contains('1 Week').should('exist');
    //cy.contains('Manual').should('exist');

    // Assert that the dropdown menu contains the three options
    const expectedOptions = ['24h', '7d', 'Manual'];
    expectedOptions.forEach((option) => {
      cy.get('[data-test="dhis2-uicore-select-menu-menuwrapper"]').contains(option).should('exist');
    });

    // Close the dropdown (optional)
    cy.get('[data-test="dhis2-uicore-select-input"]').click();
    */
  });
});

//});
