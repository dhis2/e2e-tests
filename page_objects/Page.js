class Page {
  constructor () {
    this.title = 'Base page';
  }

  open (path) {
    this.baseUrl = browser.options.baseUrl;
    browser.url(path);
  }
}

export default Page;
export const page = new Page();
