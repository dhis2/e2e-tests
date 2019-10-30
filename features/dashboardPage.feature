Feature: Dashboard page

    Background:
        Given I open up the application
        And I am logged in

    Scenario: I see the navigation bar
        Then I expect that header is visible

    Scenario: Dashboard filters opens without errors
        Then every dashboard item should open without errors
    
