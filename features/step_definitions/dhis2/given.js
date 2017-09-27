import { defineSupportCode } from 'cucumber';

import login from '../../support/action/dhis2/login.js';

defineSupportCode(({ Given }) => {
    Given(
        /^I am logged in as "([^"]+)" "([^"]+)"$/,
        login
    );
});
