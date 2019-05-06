Feature: Data visualiser app
 
Background: 
  Given I am authenticated
  
  Scenario: Opens favorites without errors
    Given I have a list of favorites saved in data-visualizer app
    Then every favorite should open without errors
