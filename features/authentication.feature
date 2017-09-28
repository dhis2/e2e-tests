Feature: Authentication

  Scenario: User logs in with correct credentials
    Given I open up the application
    When I login as "admin" with password as "district"
    Then I should be authenticated

  Scenario: User logs in with bad credentials
    Given I open up the application
    When I login as "foo" with password as "bar"
    Then I should not be authenticated
