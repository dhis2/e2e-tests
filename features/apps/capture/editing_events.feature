Feature: Editing events

Background: Background name
  Given I open up the application
  #Given I am logged in
  #And I open the capture app


Scenario: Deletes event
  Given I select org unit "Ngelehun CHC"
  And I select the program "Information Campaign"
  And there is at least one event in the list
  And I have the table rows count
  When I click on event content button
  And I click on delete event button
  Then there is one less event in the list
  
   