import { loginPage } from '@page_objects/Login';

module.exports = (username, password) => {
  loginPage.doLogin(username, password);
};
