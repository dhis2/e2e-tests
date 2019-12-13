import { login}  from '@support/action';
import { When } from 'cucumber';

When(
  /^I login as "(.+)" with password as "(.+)"$/, 
    login
);

When(
  /^I open up the application$/,
  () => {
    console.log("Opening browser");
    browser.url("");
  }
);

