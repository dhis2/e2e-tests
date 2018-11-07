import { defineSupportCode } from 'cucumber';

import isVisible from '../../support/check/isVisible';

import logout from '../../support/action/dhis2/logout';

import { loginPage } from '../../../page_objects/Login';
import { dashboardPage } from '../../../page_objects/Dashboard';

defineSupportCode(({ Then }) => {
    Then(
        /^I should( not)? be authenticated$/,
        (falseCase) => {
            if (falseCase) {
                browser.waitForExist(loginPage.loginForm.selector);
                isVisible(loginPage.loginForm);
                isVisible(loginPage.loginMessage);

                assert(loginPage.loginMessage.getText() === 'Invalid login information');
            }
            else {
                browser.waitForExist(dashboardPage.headerDiv.selector);
                isVisible(dashboardPage.headerDiv);
            }
        }
    );

    Then(
        /^I expect that the login form is( not)* visible$/,
        (falseCase) => {
            console.log(falseCase);
            isVisible(loginPage.loginForm, falseCase);
            isVisible(loginPage.usernameInput, falseCase);
            isVisible(loginPage.passwordInput, falseCase);
            isVisible(loginPage.submitButton, falseCase);
        }
    );

    Then(
        /^I expect that header is visible$/,
        () => {
            browser.waitForExist(dashboardPage.headerDiv.selector);
            isVisible(dashboardPage.headerDiv);
        }
    )
    Then(
        /^I expect the logout link to be present$/,
        () => {
            isVisible(dashboardPage.logoutLink, false);
        }
    );

    Then(
        /^I should be able to logout$/,
        logout
    );
});
