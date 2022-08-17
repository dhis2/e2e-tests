const Mocha = require('mocha');
var JiraService = require('./jira-service');
const {
  EVENT_TEST_BEGIN,
  EVENT_TEST_END,
  EVENT_RUN_BEGIN,
  EVENT_SUITE_BEGIN,
} = Mocha.Runner.constants;

const PASSED = 'passed';
const FAILED = 'failed';

class Reporter {
  constructor(runner, config) {
    const updatedConfig = {
      ...config,
      reporterOptions: {
        ...config.reporterOptions,
        isEnabled: config.reporterOptions.isEnabled || process.env.JIRA_ENABLED,
        username: config.reporterOptions.username || process.env.JIRA_USERNAME,
        password: config.reporterOptions.password || process.env.JIRA_PASSWORD,
        versionName: config.reporterOptions.versionName || process.env.JIRA_RELEASE_VERSION_NAME
      },
    };
    this.options = updatedConfig.reporterOptions;
    this.isConfigured = false;

    runner.on(EVENT_RUN_BEGIN, () => {
      this._configure()
    })

    runner.on(EVENT_SUITE_BEGIN, (suite) => {
      this.beforeSuite(suite)
    })

    runner.on(EVENT_TEST_BEGIN, (test) => {
      this.beforeTest(test);
    })

    runner.on(EVENT_TEST_END, (test) => {
      this.afterTest(test)
    })
  }

  beforeSuite(context) {
    const suite = context.title;

    if (!this.isConfigured || !suite) {
      return;
    }

    try {
      this.jira_issue = suite.split("->")[1].trim();
    } catch (e) { this._log("Jira issue was undefined. Skipping reporting") }

    this._log(`Running suite ${suite}, JIRA issue number: ${this.jira_issue}`);
    this.jiraService.createExecution(this.jira_issue)
      .then((executionId) => {
        this._log('Created execution with id : ' + executionId)
        this.executionId = executionId;
        this.jiraService.updateExecutionStatus(executionId, this._getStatus(PASSED));
      });
    
  }

  beforeTest(test) {
    if (!this.isConfigured || !this.jira_issue) {
      return;
    }
    const step = test.title;

    this._createOrUpdateTestStep(step)

    this.last_tag = step;
  }

  afterTest(context) {
    if (!this.isConfigured || !this.jira_issue) {
      return;
    }
    let status = context.state ? PASSED : FAILED;

    if (status == FAILED) {
      this.jiraService.updateExecutionStatus(this.executionId, this._getStatus(FAILED));
    }

    var execution = this._createOrUpdateTestStepExecution(status);
    this._trackExecutionChange(execution);
  }
  _log(text) {
    console.log('[jira-reporter] ' + text)
  }

  _configure() {
    if ((!this.options.isEnabled || this.options.isEnabled == 'false')) {
      this._log('Jira reporter is disabled. Skipping configuration.')
      return;
    }

    ["jiraUrl", "projectId", "versionName", "testCycle", "username", "password"].forEach((opt) => {
      this._validate(this.options, opt)
    })

    this._log('JIRA service configured. Will push to version: ' + this.options.versionName)
    this.jiraService = new JiraService(this.options.username, this.options.password, this.options.jiraUrl, this.options.projectId, this.options.versionName.trim(), this.options.testCycle);
    this.isConfigured = true;
  }

  _validate(options, name) {
      if (options == null) {
        throw new Error("Missing --reporter-options in mocha.opts");
      }
      if (options[name] == null) {
        throw new Error(
          `Missing ${name} value. Please update --reporter-options in mocha.opts`
        );
      }
    }
  
  _createOrUpdateTestStep(text, data, result) {
    if (!this.jira_issue) {
      return;
    }

    this.jiraService.createOrUpdateTestStep(this.jira_issue, text, data, result)
      .then((id) => {
        this.last_step_id = id;
        this.last_step_name = text;
      });

  }

  _createOrUpdateTestStepExecution(status) {
    let _status = this._getStatus(status);
    this.stepFailures = _status == 2 ? true : this.stepFailures;

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
  }

  _getStatus(statusString) {
    let _status = statusString == PASSED ? 1 : 2;

    return _status;
  }
  _trackExecutionChange(execution) {
    if ([PASSED, 1, "1"].includes(execution.previousStatus) && ![PASSED, 1, "1"].includes(execution.status)) {

      this._log(`New test failure found`);

      let json = {
        "name": execution.stepName,
        "oldStatus": execution.previousStatus,
        "newStatus": execution.status
      }

      let reportsdir = process.cwd() + '/reports';
      let file = '/new_failures.json';
      fs.exists(reportsdir, (exists) => {
        if (!exists) {
          fs.mkdir(reportsdir, () => {
            this._log('Reports dir created.')
          });
        }

        fs.appendFile(reportsdir + file, `${JSON.stringify(json)}\r\n`, () => {
          this._log(`Failure ${JSON.stringify(json)} added to ${reportsdir}${file}`);
        });
      });

    }
  }
}

module.exports = Reporter;