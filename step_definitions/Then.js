import { Then } from 'cucumber';
import { checkTitle } from '@support/check';
 
Then(
  /^I expect that the title is( not)* "([^"]*)?"$/,
  checkTitle
);
