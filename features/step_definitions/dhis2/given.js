import { defineSupportCode } from 'cucumber';

import isVisible from '../../support/check/isVisible';

import login from '../../support/action/dhis2/login.js';
import { dashboardPage } from '../../../page_objects/Dashboard';

defineSupportCode(({ Given }) => {
    Given(
        /^I am logged in$/,
        () => {
            // login as standard user
            login('admin', 'district');
            browser.waitForVisible(dashboardPage.mainPageDiv.selector);
            isVisible(dashboardPage.mainPageDiv);
        }
    );
});
