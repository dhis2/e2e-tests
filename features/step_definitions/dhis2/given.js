import { defineSupportCode } from 'cucumber';

import isVisible from '../../support/check/isVisible';

import login from '../../support/action/dhis2/login.js';
import { dashboardPage } from '../../../page_objects/Dashboard';

defineSupportCode(({ Given }) => {
    Given(
        /^I open up the application$/,
        () => {
            browser.url('/');
        }
    );

    Given(
        /^I am logged in$/,
        () => {
            // login as standard user
            login('admin', 'district');

            isVisible(dashboardPage.mainPageDiv, false);
        }
    );
});
