Feature: Pivot tables app
 
Background: 
  Given I am authenticated
  
  Scenario: Opens favorites without errors
    Given I have a list of favorites saved in pivot app
    Then every favorite should open without errors
