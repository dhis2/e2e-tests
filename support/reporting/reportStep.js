import { saveScreenshot } from '@support/action';
import fs from 'fs';

module.exports = (stepName, expectedResult, status, allureContent) => {
  const execution = browser.addJiraStepExecution(`${stepName}`, null, expectedResult, status)

  if (["passed", 1, "1"].includes(execution.previousStatus)
    && !["passed", 1, "1"].includes(execution.status)) {
    trackStatusChange(execution.stepName, execution.previousStatus, execution.status);
    
    stepName = `NEW FAILURE! ${stepName}`
  }

  allure.addStep(stepName, { content: allureContent, name: 'Errors' }, status);

  if (status == 'failed') {
    saveScreenshot();
  }
}

var trackStatusChange = function (name, oldStatus, newStatus) {
  console.error(`New test failure found`);

  let json = {
    "name": name,
    "oldStatus": oldStatus,
    "newStatus": newStatus
  }

  browser.call(() => {
    let reportsdir = __basedir + '/reports';
    fs.exists(reportsdir, (exists) => {
      if (!exists) {
        fs.mkdir(reportsdir, () => {
          console.log('Reports dir created.')
        });
      }

      fs.appendFile(reportsdir + '/new_failures.txt', `${JSON.stringify(json)}\r\n`, () => {
        console.log('ok')
      });
    });
  })
}
