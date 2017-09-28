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
                isVisible(loginPage.loginForm, false);
                isVisible(loginPage.loginMessage, false);

                assert(loginPage.loginMessage.getText() === 'Wrong user name or password');
            }
            else {
                isVisible(dashboardPage.headerDiv, false);
            }
        }
    );

    Then(
        /^I expect that the login form is( not)* visible$/,
        (falseCase) => {
            isVisible(loginPage.loginForm, falseCase);
            isVisible(loginPage.usernameInput, falseCase);
            isVisible(loginPage.passwordInput, falseCase);
            isVisible(loginPage.submitButton, falseCase);
        }
    );

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
