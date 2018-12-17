import Page from './Page';

class Login extends Page {
  get loginForm () { return browser.element('#loginForm'); }
  get loginMessage () { return browser.element('#loginMessage'); }
  get usernameInput () { return browser.element('#j_username'); }
  get passwordInput () { return browser.element('#j_password'); }
  get submitButton () { return browser.element('input[type=submit]'); }

  open () {
    super.open('dhis-web-commons/security/login.action');
  }

  doLogin (username, password) {
    this.open();

    browser.waitForExist(this.loginForm.selector);

    this.usernameInput.setValue(username);
    this.passwordInput.setValue(password);
    this.submitButton.click();
  }
}

export default Login;
export const loginPage = new Login();
