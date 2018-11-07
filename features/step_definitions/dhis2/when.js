import { defineSupportCode }  from 'cucumber';

import login from '../../support/action/dhis2/login.js';

defineSupportCode(({ When }) => {
    When(
        /^I login as "(.+)" with password as "(.+)"$/,
        login
    );

    When(
        /^I open up the application$/,
        () => {
            browser.url('');
        }
    );
});
