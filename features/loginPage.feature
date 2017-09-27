Feature: Login page

Scenario: Land on login page

  Given I open the site "/"
  Then I expect that the title is "DHIS 2 Demo - Sierra Leone"
  And I expect that the login form is visible
