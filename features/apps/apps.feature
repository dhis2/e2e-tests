Feature: Apps

@DHIS2-8017
Scenario: All apps opens without console errors
  Given I am authenticated
  And I have a list of installed core apps
  Then every app should open without errors