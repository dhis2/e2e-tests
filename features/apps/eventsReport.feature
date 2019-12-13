Feature: Event reports app
 
Background: 
  Given I am authenticated
  
  @DHIS2-8019
  Scenario: Opens favorites without errors
    Given I have a list of favorites saved in event reports app
    Then every favorite should open without errors
