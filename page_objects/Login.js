import Page from './Page';

class Login extends Page {
    get usernameInput() { return browser.element('input#j_username') }
    get passwordInput() { return browser.element('input[type=password]') }
    get submitButton() { return browser.element('input[type=submit]') }

    doLogin(username, password) {
        this.open();
        this.usernameInput.setValue(username);
        this.passwordInput.setValue(password);
        this.submitButton.click();

        browser.pause(2000);
    }
}

export default Login;
export const loginPage = new Login();
