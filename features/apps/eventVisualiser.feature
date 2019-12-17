Feature: Event visualiser app
 
Background: 
  Given I am authenticated
  
  @DHIS2-8020
  Scenario: Opens favorites without errors
    Given I have a list of favorites saved in event-visualizer app
    Then every favorite should open without errors
