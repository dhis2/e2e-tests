Feature: Authentication

  Scenario: User logs in with correct credentials
    When I open up the application
    And I login as a valid user
    Then I should be authenticated

  Scenario: User logs in with bad credentials
    When I open up the application
    And I login as an invalid user
    Then I should not be authenticated
