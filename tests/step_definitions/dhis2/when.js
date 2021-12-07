import { login}  from '#support/action';
import { When } from '@cucumber/cucumber';

When(
  /^I login as "(.+)" with password as "(.+)"$/,
    login
);

When(
  /^I login as a valid user$/,
  () => {
    // login as standard user
    login(browser.config.superUser, browser.config.superUserPassword);
  }
);


When(
  /^I login as an invalid user$/,
  () => {
    // login as standard user
    login("foo", "bar");
  }
);

When(
  /^I open up the application$/,
  () => {
    console.log("Opening browser");
    browser.url("");
  }
);
