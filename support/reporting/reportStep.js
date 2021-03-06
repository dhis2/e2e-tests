import { saveScreenshot } from '#support/action';

module.exports = (stepName, expectedResult, status, allureContent) => {
  try {
    const execution = browser.addJiraStepExecution(`${stepName}`, null, expectedResult, status)

    if (["passed", 1, "1"].includes(execution.previousStatus)
      && !["passed", 1, "1"].includes(execution.status)) {
        stepName = `NEW FAILURE! ${stepName}`
    } 
  }
  catch(e) { console.log(e)}
  
  allure.addStep(stepName, { content: allureContent, name: 'Errors' }, status);

  if (status == 'failed') {
    console.log(`${stepName} has failed`);
    saveScreenshot();
  }
}
