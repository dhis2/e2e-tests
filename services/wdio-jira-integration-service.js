import JiraService from "./jira-service";
import fs from 'fs';

class WdioJiraService {
  constructor(config) {
    this.options = config;
    this.isConfigured = false;
  }

  _configure() {
    if (!this.options.isEnabled) {
      return;
    }

    if (!this.options.instanceUrl) {
      throw new Error('instanceUrl property is not configured')
    }

    if (!this.options.projectId) {
      throw new Error('projectId property is not configured');
    }

    if (!this.options.versionName) {
      throw new Error('versionName property is not configured');
    }

    if (!this.options.testCycle) {
      throw new Error('testCycle property is not configured')
    }

    const username = this.options.username || process.env.JIRA_USERNAME;
    const password = this.options.password || process.env.JIRA_PASSWORD;
    const cycleName = this.options.cycleName || 'automated-tests';

    if (!username || !password) {
      throw new Error('username or password property is not configured');
    }

    console.log('JIRA service configured. Will push to version: ' + this.options.versionName)
    this.jiraService = new JiraService(username, password, this.options.instanceUrl, this.options.projectId, this.options.versionName.trim(), cycleName);
    this.isConfigured = true;
  }

  beforeSession() {
    this._configure();
  }

  before() {
    if (!this.isConfigured) {
      return;
    }

    global.browser.addCommand('addJiraStepExecution', (step, data, result, status) => {
      this._createOrUpdateTestStep(step, data, result);
     
      var execution = this._createOrUpdateTestStepExecution(status);
      this._trackExecutionChange(execution);

      return execution;
    })
  }

  beforeFeature(uri, feature) {
    if (!this.isConfigured) {
      return;
    }

    this.feature = feature;
    this.stepFailures = false;

    const tags = feature.document.feature.tags;
    if (!tags || !tags.length) {
      return;
    }

    this.featureTags = tags;
  }

  beforeScenario(uri, feature, scenario) {
    if (!this.isConfigured ) {
      return;
    }

    const tags = this.featureTags ? this.featureTags : scenario.tags;

    if ( !tags || !tags.length) {
      return;
    }

    this.jira_issue = tags[0].name.replace('@', '');
    console.log(`JIRA issue number: ${this.jira_issue}`);

    browser.call(() => {
      return this.jiraService.createExecution(this.jira_issue)
        .then((executionId) => {
          this.executionId = executionId;
        });

    })
  }

  beforeStep(details) {
    if (!this.isConfigured || !this.jira_issue) {
      return;
    }
    const step = details.step.step;
    const isExpectedResult = step.keyword.includes('Then') ||
      (step.keyword.includes('And') && this.last_tag.includes('Then'));

    if (this.last_step_id && isExpectedResult) {
      browser.call(() => {
        return this.jiraService.addResultToTheStep(this.jira_issue, this.last_step_id, step.text);
      })
    }

    else (
      this._createOrUpdateTestStep(step.text)
    )

    this.last_tag = step.keyword;
  }

  afterStep(details,context, { error, result, duration, passed }) {
    if (!this.isConfigured || !this.jira_issue) {
      return;
    }
  
    let status = passed ? 'passed' : 'failed';
    var execution = this._createOrUpdateTestStepExecution(status);
    if (details.step.step.text.includes('every')) return;
    this._trackExecutionChange(execution); 
  }

  afterScenario(uri, feature, scenario, result) {
    if (!this.isConfigured || !this.jira_issue || this.featureTags) {
      return;
    }

    this._createOrUpdateExecution(result.status);
  }

  afterFeature() {
    if (!this.isConfigured || !this.jira_issue || !this.featureTags) {
      return;
    }

    let status = this.stepFailures ? 'failed' : 'passed';

    this._createOrUpdateExecution(status);
  }

  _createOrUpdateTestStep(text, data, result) {
    if (!this.jira_issue) {
      throw new Error('No JIRA issue defined in scenario or feature tags');
    }

    browser.call(() => {
      return this.jiraService.createOrUpdateTestStep(this.jira_issue, text, data, result)
        .then((id) => {
          this.last_step_id = id;
          this.last_step_name = text;
        });
    })
  }

  _createOrUpdateExecution(status) {
    let _status = this._getStatus(status);

    browser.call(() => {
      return this.jiraService.updateExecutionStatus(this.executionId, _status);
    })
  }

  _createOrUpdateTestStepExecution(status) {
    let _status = this._getStatus(status);
    this.stepFailures = _status == 2 ? true: this.stepFailures;
    
    return browser.call(() => {
      return this.jiraService.getStepResultForStepWithinExecution(this.executionId, this.last_step_id)
        .then(stepResult => {
          if (!stepResult) {
            return this.jiraService.createStepResult(this.executionId, this.last_step_id, this.jira_issue, _status)
              .then(() => {
                return {
                  stepName: this.last_step_name,
                  previousStatus: undefined,
                  status: _status
                }
              })
          }

          return this.jiraService.updateStepResult(stepResult.id, _status)
            .then(() => {
              return {
                stepName: this.last_step_name,
                previousStatus: stepResult.status,
                status: _status
              }
            });
        })
    })
  }

  _getStatus(statusString) {
    let _status = statusString == 'passed' ? 1 : 2;

    return _status;
  }
  
  _trackExecutionChange(execution) {
    if (["passed", 1, "1"].includes(execution.previousStatus) && !["passed", 1, "1"].includes(execution.status)) {
      
      console.error(`New test failure found`);
    
      let json = {
        "name": execution.stepName,
        "oldStatus": execution.previousStatus,
        "newStatus": execution.status
      }
    
      browser.call(() => {
        let reportsdir = __basedir + '/reports';
        let file = '/new_failures.json';
        fs.exists(reportsdir, (exists) => {
          if (!exists) {
            fs.mkdir(reportsdir, () => {
              console.log('Reports dir created.')
            });
          }
    
          fs.appendFile(reportsdir + file, `${JSON.stringify(json)}\r\n`, () => {
            console.log(`Failure ${JSON.stringify(json)} added to ${reportsdir}${file}`);
          });
        });
      })
    } 
  }
}

export default WdioJiraService;