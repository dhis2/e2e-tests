class Page {
    constructor() {
        this.title = 'Base page';
        this.baseUrl = browser.options.baseUrl;
    }

    open(path) {
        browser.url('/' + path);
    }
}

export default Page;
export const page = new Page();
