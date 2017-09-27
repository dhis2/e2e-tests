import { defineSupportCode } from 'cucumber';

//import checkClass from '../../support/check/checkClass';
//import checkContainsAnyText from '../../support/check/checkContainsAnyText';
//import checkIsEmpty from '../../support/check/checkIsEmpty';
//import checkContainsText from '../../support/check/checkContainsText';
//import checkCookieContent from '../../support/check/checkCookieContent';
//import checkCookieExists from '../../support/check/checkCookieExists';
//import checkDimension from '../../support/check/checkDimension';
//import checkEqualsText from '../../support/check/checkEqualsText';
//import checkFocus from '../../support/check/checkFocus';
//import checkInURLPath from '../../support/check/checkInURLPath';
//import checkIsOpenedInNewWindow from
//    '../../support/check/checkIsOpenedInNewWindow';
//import checkModal from '../../support/check/checkModal';
//import checkModalText from '../../support/check/checkModalText';
//import checkNewWindow from '../../support/check/checkNewWindow';
//import checkOffset from '../../support/check/checkOffset';
//import checkProperty from '../../support/check/checkProperty';
//import checkSelected from '../../support/check/checkSelected';
//import checkTitle from '../../support/check/checkTitle';
//import checkURL from '../../support/check/checkURL';
//import checkURLPath from '../../support/check/checkURLPath';
//import checkWithinViewport from '../../support/check/checkWithinViewport';
//import compareText from '../../support/check/compareText';
//import isEnabled from '../../support/check/isEnabled';
//import isExisting from '../../support/check/isExisting';
import isVisible from '../../support/check/isVisible';
//import waitFor from '../../support/action/waitFor';
//import waitForVisible from '../../support/action/waitForVisible';

import logout from '../../support/action/dhis2/logout';

import { loginPage } from '../../../page_objects/Login';
import { dashboardPage } from '../../../page_objects/Dashboard';

defineSupportCode(({ Then }) => {
    Then(
        /^I expect that the login form is( not)* visible$/,
        (falseCase) => {
            isVisible(loginPage.usernameInput, falseCase);
            isVisible(loginPage.passwordInput, falseCase);
        }
    );

    Then(
        /^I expect the logout link to be present$/,
        () => {
            isVisible(dashboardPage.logoutLink.selector, false);
        }
    );

    Then(
        /^I should be able to logout$/,
        logout
    );
});
