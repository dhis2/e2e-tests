
const request = require('request');

class JiraService {
  constructor(username, password, instanceUrl, projectId, versionName, cycleName) {
    this.username = username;
    this.password = password;
    this.instanceUrl = instanceUrl;
    this.projectId = projectId;
    this.cycleName = cycleName;
    this.versionName = versionName;
    this.versionId = 0

    Promise.all([this._getProjectVersionIdByName(this.versionName)])
      .then((promises) => {
        this.versionId = promises[0];
      })
  }

  getStepResultForStepWithinExecution(executionId, stepId) {
    return this._request(`/stepResult?executionId=${executionId}`)
      .then(stepResults => {
        if (stepResults) {
          let matchingResults = stepResults.filter(sr => {
            return sr.stepId == stepId;
          })
  
          if (!matchingResults || !matchingResults.length) {
            return Promise.resolve(undefined);
          };

          return Promise.resolve(matchingResults[0]);
        }
       
        return Promise.resolve(undefined);    
      })
  }

  updateStepResult(stepResultId, status) {
    let body = {
      'status': status
    }

    return this._request(`/stepResult/${stepResultId}`, 'PUT', body);
  }

  createStepResult(executionId, stepId, issueKey, status) {
    return this._getIssueId(issueKey)
      .then((issueId) => {
        let body = {
          'stepId': stepId,
          'issueId': issueId,
          'executionId': executionId,
          'status': status
        }

        return Promise.resolve(body);
      })
      .then(body => { return this._request(`/stepResult`, 'POST', body) })
      .then(response => { return Promise.resolve(response.id) });
  }

  getCyclesByProject() {
    return this._request(`/cycle?projectId=${this.projectId}`)
      .then((body) => {
        let object = [];
        Object.keys(body).forEach((key) => {
          body[key].forEach((obj) => {

            let cycle = obj;
            cycle.cycleId = key;
            object.push(cycle);

          })
        })

        return object;
      });
  }

  getTestSteps(issueKey) {
    let issueId = this._getIssueId(issueKey);

    return issueId
      .then(issueId => { return this._request('/teststep/' + issueId) })
      .then(steps => {
        return Promise.resolve(steps.stepBeanCollection);
      });
  }

  createStep(issueId, step, data, result) {
    let postBody = {
      "step": step,
      "data": data,
      "result": result
    }

    return this._request(`/teststep/${issueId}`, 'POST', postBody)
      .then(response => {
        return Promise.resolve(response.id);
      })
  }

  addResultToTheStep(issueKey, stepId, result) {
    let issueId;
    return this._getIssueId(issueKey)
      .then((id) => { issueId = id; return this._request(`/teststep/${issueId}/${stepId}`) })
      .then(testStep => {
        let body = testStep;

        if (!body.result.includes(result)) {
          body.result += `\n\n ${result}`
        }

        return Promise.resolve(body);
      })
      .then(body => { return this._request(`/teststep/${issueId}/${stepId}`, 'PUT', body) })
      .then(response => {
        return Promise.resolve(response.id);
      });
  }

  createOrUpdateTestStep(issueKey, step, data, result) {
    let issueId;
    return this._getIssueId(issueKey)
      .then(id => { issueId = id; return this.getTestSteps(issueKey) })
      .then(testSteps => {
        let matchingSteps = testSteps.filter(ts => {
          return ts.step.includes(step);
        })

        return Promise.resolve(matchingSteps);
      })
      .then(matchingSteps => {
        if (!matchingSteps || !matchingSteps.length) {
          return this.createStep(issueId, step, data, result);
        }

        else {
          const matchingStep = matchingSteps[0];

          matchingStep.data = data;
          matchingStep.result = result;

          return this._request('/teststep/' + issueId + "/" + matchingStep.id)
            .then(() => {
              return Promise.resolve(matchingStep.id);
            })
        }
      })
  }

  createCycleIfNotExist() {
    return this.getCycleIdByVersionName(this.versionName)
      .then(cycleId => {
        if (cycleId) {
          return Promise.resolve(cycleId);
        }

        let postBody = {
          "name": this.cycleName,
          "description": 'automated tests cycle',
          "projectId": this.projectId,
          "versionId": this.versionId
        }

        return this._request(`/cycle`, 'POST', postBody)
          .then(response => {
            return response.id;
          });
      })
  }

  getCycleIdByVersionName(versionName) {
    return this._getProjectVersionIdByName(versionName)
      .then(versionId => { return this._request(`/cycle?projectId=${this.projectId}&versionId=${versionId}`) })
      .then(cycle => {
        let cycleId;

        Object.keys(cycle).forEach(key => {
          if (cycle[key].name == this.cycleName) {
            cycleId = key;
          }
        })

        return Promise.resolve(cycleId);
      })
  }

  createExecution(issueKey) {
    let issueId = this._getIssueId(issueKey);
    let cycleId = this.createCycleIfNotExist();

    return Promise.all([issueId, cycleId])
      .then((promises) => {
        let body = {
          "projectId": this.projectId,
          "issueId": promises[0],
          "versionId": this.versionId,
          "cycleId": promises[1]
        }

        return Promise.resolve(body);
      })
      .then(body => {
        return this._request('/execution', 'POST', body)
      })
      .then(response => {
        return Promise.resolve(Object.keys(response)[0]);
      })
  }

  updateExecutionStatus(executionId, status) {
    let body = {
      'status': status
    };
    return this._request(`/execution/${executionId}/execute`, 'PUT', body);
  }

  _getProjectVersionIdByName(versionName) {
    return this._jiraRequest(`/project/${this.projectId}/versions`)
      .then((body) => {
        let version = body.filter((version) => {
          return version.name == versionName;
        });

        return Promise.resolve(version[0].id);
      })
  }

  _getIssueId(issueKey) {
    return this._jiraRequest('/issue/' + issueKey)
      .then((body) => {
        return Promise.resolve(body.id);
      });
  }

  _jiraRequest(url, method) {
    let options = {
      'method': method,
      'url': `${this.instanceUrl}/rest/api/latest${url}`,
      'auth': {
        'user': this.username,
        'password': this.password
      }
    }

    let promise = this._createPromiseCall(options);
    return promise;
  }

  _request(url, method, body) {
    let options = {
      'method': method,
      'url': `${this.instanceUrl}/rest/zapi/latest${url}`,
      'auth': {
        'user': this.username,
        'password': this.password
      }
    }

    if (body) {
      options.json = body;
    }

    let promise = this._createPromiseCall(options);
    return promise;
  };

  _createPromiseCall(params) {
    return new Promise(function (resolve, reject) {
      request(params, (err, response, body) => {
        if (err) {
          console.log(err);
          reject(err);
        }

        let jsonResponse;

        try {
          jsonResponse = JSON.parse(body);
        }

        catch (err) {
          jsonResponse = body;
        }
        resolve(jsonResponse);
      })

    }).catch((err) => { console.log(`an error occured with the api call: "${err}'`) })
  }

}

module.exports = JiraService;