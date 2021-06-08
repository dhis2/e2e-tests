import { Given, Then, When } from '@cucumber/cucumber';
import { captureHeaderBar, captureIndexPage, captureNewEventForm, captureViewEventPage, captureCommentsSection } from '#page_objects/capture';
import { waitForWindowToLoad } from '#support/wait';

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
  if (eventCount > 1) {
    return;
  }

  captureHeaderBar.openNewEventFormInProgram();
  captureNewEventForm.fillAndSave();
  eventCount += 1;
})

When(/^I click on event content button for the (\d+) event/, (number) => {
  captureIndexPage.tableRows[number - 1].$('[data-test="event-content-menu"]').click();
})

When(/^I click on delete event button/, () => {
  captureIndexPage.deleteEventButton.click();
  waitForWindowToLoad();
})

var eventId;
When(/^I have the id of the (\d+) event on the list/,(number) => {
  captureIndexPage.tableRows[number -1].click();
  waitForWindowToLoad();

  eventId = browser.getUrl().match(/([^\/]+$)/)[0];
  expect(eventId).to.not.be.undefined;

  browser.back();
  waitForWindowToLoad();
})

Then(/^the event with that id is deleted/, () => {
  captureViewEventPage.open(eventId);

  expect(browser.$('#root').getText()).to.contain('Event could not be loaded. Are you sure it exists?');
})


Given(/^I click on new event button/, () => {
  captureHeaderBar.openNewEventFormInProgram();
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

  expect(captureIndexPage.eventsTable.isExisting()).to.equal(true)
})


Then(/^the comment "(.+)" should be displayed correctly/, (comment) => {
  expect(captureNewEventForm.commentsSection.comments.length).to.be.greaterThan(0);
  var commentElementText = captureNewEventForm.commentsSection.comments[0].$('[data-test="comment-text"] p');
  
  if (comment.includes('*bold*')) {
    expect(commentElementText.$('strong').getText()).to.equal('bold')
  }

  if (comment.includes('_italic_')) {
    expect(commentElementText.$('em').getText()).to.equal('italic');
  }

  if (comment.includes('https')) {
    let regex = /\b(https?:\/\/\S*\b\/)/g;
    var commentUrl = comment.match(regex)[0];

    expect(commentElementText.$('a').getText()).to.equal(commentUrl);
    expect(commentElementText.$('a').getAttribute('href')).to.equal(commentUrl);
  }
})

When(/^I open the last saved event/, () => {
  var programId = browser.getUrl().match('(?<=programId=)(.*)(?=&)')[0];
  var ouId = browser.getUrl().match('(?<=orgUnitId=)(.*)')[0];
 
  browser.url(`api/events.json?program=${programId}&orgUnit=${ouId}&order=created:desc&pageSize=1`);
  
  var eventId = JSON.parse(browser.$('body pre').getText()).events[0].event;

  captureViewEventPage.open(eventId);
})

Then(/^the author of "(.+)" should be "(.+)" user/, (commnt, user) => {
  let commentText = commnt.replace(/\*/g, '').replace(/_/g, '');
  expect(captureCommentsSection.commentByValue(commentText).$('[data-test=comment-user]').getText()).to.equal(user);
})


