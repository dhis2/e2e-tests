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
  And I have the id of the 1 event on the list
  When I click on event content button for the 1 event
  And I click on delete event button
  Then the event with that id is deleted

@DHIS2-4457
Scenario Outline: Adds event with a comment
  Given I click on new event button
  And I fill the new event form
  And I add new comment <comment>
  When I save the event
  And I open the last saved event
  Then the author of <comment> should be "system" user
  And the comment <comment> should be displayed correctly
  Examples:
      | comment                                                      |
      | "Test comment with *bold* _italic_ https://play.dhis2.org/"  |
     

