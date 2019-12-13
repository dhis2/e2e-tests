Feature: Login page

@DHIS2-7961
Scenario: Land on login page
    When I open up the application
    Then I expect that the title is "DHIS 2 Demo - Sierra Leone"
    And I expect that the login form is visible
