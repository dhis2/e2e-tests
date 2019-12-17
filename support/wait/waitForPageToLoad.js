module.exports = () => {
  const ms = 20000;
  browser.waitForVisible('circle', ms, true);
};
