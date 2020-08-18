import { Given, Then, When } from 'cucumber';
import { captureHeaderBar, captureIndexPage, captureNewEventForm, captureViewEventPage, captureCommentsSection } from '@page_objects/capture';
import { waitForWindowToLoad } from '@support/wait';

Given(/^I open the capture app/, () => {
  captureIndexPage.open();
});

Given(/^I select org unit "(.+)"/, (ou) => {
  captureIndexPage.selectOrgUnitByName(ou);
})

Given(/^I select the program "(.+)"/, (program) => {
  captureIndexPage.selectProgram(program);
})

var eventCount;

Given(/^there is at least one event in the list/, () => {
  eventCount = captureIndexPage.tableRowCount;
  console.log('event count ' + eventCount)
  if (eventCount > 1) {
    return;
  }

  captureHeaderBar.newEventButton.click();
  waitForWindowToLoad();
  captureNewEventForm.fillAndSave();
  eventCount += 1;
})

When(/^I click on event content button/, () => {
  captureIndexPage.tableRows[1].$('[data-test="dhis2-capture-event-content-menu"]').click();
})

When(/^I click on delete event button/, () => {
  captureIndexPage.deleteEventButton.click();
  waitForWindowToLoad();
})

Then(/^there is one less event in the list/, () => {
  expect(captureIndexPage.tableRowCount).to.be.equal(eventCount - 1)
})

Given(/^I click on new event button/, () => {
  captureHeaderBar.newEventButton.click();
  waitForWindowToLoad();
})

Given(/^I fill the new event form/, () => {
  captureNewEventForm.fill();
})

Given(/^I add new comment "(.+)"/, (comment) => {
  captureNewEventForm.commentsSection.newCommentButton.click();
  captureNewEventForm.commentsSection.newCommentTextField.setValue(comment)
  captureNewEventForm.commentsSection.saveCommentButton.click();
})

When(/^I save the event/, () => {  
  captureNewEventForm.mainSaveButton.click();
  waitForWindowToLoad();
})


Then(/^the comment "(.+)" should be displayed/, (comment) => {
  expect(captureNewEventForm.commentsSection.comments.length).to.be.greaterThan(0);
  expect(captureNewEventForm.commentsSection.comments[0].$('[data-test="dhis2-capture-comment-text"] p').getText()).to.equal(comment);
})

When(/^I open the last saved event/, () => {
  var programId = browser.getUrl().match('(?<=programId=)(.*)(?=&)')[0];
  var ouId = browser.getUrl().match('(?<=orgUnitId=)(.*)')[0];
 
  browser.url(`api/events.json?program=${programId}&orgUnit=${ouId}&order=created:desc&pageSize=1`);
  
  var eventId = JSON.parse(browser.$('body pre').getText()).events[0].event;

  captureViewEventPage.open(eventId);
})

Then(/^the author of "(.+)" should be "(.+)" user/, (commnt, user) => {
  expect(captureCommentsSection.commentByValue(commnt).$('[data-test=dhis2-capture-comment-user]').getText()).to.equal(user);
})


