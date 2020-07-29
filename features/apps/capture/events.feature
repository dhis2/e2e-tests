Feature: Events

Background: Opens the capture app
  Given I open up the application
  Given I am logged in
  And I open the capture app
  And I select org unit "Ngelehun CHC"
  And I select the program "Information Campaign"

@DHIS2-5287
Scenario: Deletes event
  Given there is at least one event in the list
  When I click on event content button
  And I click on delete event button
  Then there is one less event in the list

Scenario: Adds event with a comment
  Given I click on new event button
  And I fill the new event form
  And I add new comment "Test comment"
  Then the comment "Test comment" should be saved

