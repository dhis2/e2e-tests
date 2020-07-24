import { Given, Then, When } from 'cucumber';
import { captureIndexPage } from '@page_objects/capture/CaptureIndexPage';

Given(/^I open the capture app/, () => {
  captureIndexPage.open();
});

Given(/^I select org unit "(.+)"/, (ou) => {
  captureIndexPage.selectOrgUnitByName(ou);
})

Given(/^I select the program "(.+)"/, (program) => {
  captureIndexPage.selectProgram(program);
})

Given(/^there is at least one event in the list/, () => {
  if (captureIndexPage.tableRowCount > 1) {
    console.log('tableRowCount > 1')
    return;
  }

  console.log('tableRowCount !> 1')
})
let count;
Given(/^I have the table rows count/, () => {
  count = captureIndexPage.tableRowCount;
})

When(/^I click on event content button/, () => {
  captureIndexPage.tableRows[1].$('[data-test="event-content-menu"]').click();
  browser.pause(2000);
})

When(/^I click on delete event button/, () => {
  captureIndexPage.deleteEventButton.click();
  browser.pause(2000)
})

Then(/^there is one less event in the list/, () => {
  expect(captureIndexPage.tableRowCount -1).to.be.equal(count - 1)
})

