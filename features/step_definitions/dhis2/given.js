import { defineSupportCode } from 'cucumber';

import isVisible from '../../support/check/isVisible';
import waitForVisible from '../../support/wait/waitForVisible';

import login from '../../support/action/dhis2/login.js';
import { dashboardPage } from '../../../page_objects/Dashboard';

defineSupportCode(({ Given }) => {
  Given(
    /^I am logged in$/,
    () => {
      // login as standard user
      login('system', 'System123');
      waitForVisible(dashboardPage.mainPageDiv.selector);
      isVisible(dashboardPage.mainPageDiv);
    }
  );

  Given(
    /^I am authenticated$/,
    () => {
      login('system', 'System123');

      browser.waitUntil(() => {
        const url = browser.getUrl();
        return url.indexOf('dhis-web') > -1 && url.indexOf('#') > -1 && url.indexOf('login.action') === -1;
      }, 10000);
    }
  );
});
