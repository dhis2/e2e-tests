Feature: Apps

Scenario: All apps opens without console errors
  Given I am logged in
  And I have a list of installed core apps
  Then every app should open without errors