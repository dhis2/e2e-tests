const Mocha = require("mocha");
const { EVENT_TEST_BEGIN, EVENT_TEST_END, EVENT_RUN_BEGIN, EVENT_SUITE_BEGIN } =
  Mocha.Runner.constants;

const PASSED = "passed";
const FAILED = "failed";

class Reporter {
  constructor(runner, config) {
    runner.on(EVENT_RUN_BEGIN, () => {
      console.log("Test run started");
    });

    runner.on(EVENT_SUITE_BEGIN, (suite) => {
      this.beforeSuite(suite);
    });

    runner.on(EVENT_TEST_BEGIN, (test) => {
      this.beforeTest(test);
    });

    runner.on(EVENT_TEST_END, (test) => {
      this.afterTest(test);
    });
  }

  beforeSuite(context) {
    const suite = context.title;
    if (!suite) {
      return;
    }
    console.log(`Running suite: ${suite}`);
  }

  beforeTest(test) {
    const step = test.title;
    console.log(`Starting test: ${step}`);
  }

  afterTest(context) {
    const status = context.state ? PASSED : FAILED;
    console.log(`Test ${context.title} finished with status: ${status}`);
  }
}

module.exports = Reporter;
