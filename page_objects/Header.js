import Page from './Page';

class Header extends Page {
  get headerElement() {
    return browser.$('#dhis2-app-root header')
  }
}

export const header = new Header();