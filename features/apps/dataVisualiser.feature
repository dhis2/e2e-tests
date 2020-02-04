Feature: Data visualiser app
 
Background: 
  Given I am authenticated
  
  @DHIS2-8018
  Scenario: Opens favorites without errors
    Given I have a list of favorites saved in data-visualizer app
    Then every favorite should open without errors
  
  @DHIS2-8241
  Scenario: Opens pivot tables without errors
    Given I have a list of pivot tables saved in data-visualizer app
    Then every favorite should open without errors
