Feature: Dashboard page

    Background:
        Given I am logged in

    Scenario: I see the navigation bar
        Then I expect that element "#header" is visible

    Scenario: I can logout
        Then I should be able to logout
