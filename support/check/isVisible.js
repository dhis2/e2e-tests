/**
 * Check if the given element is (not) visible
 * @param  {String}   element   Element selector
 * @param  {Object}   element   WebElement JSON object
 * @param  {String}   shouldNotBeVisible Pass this if element should not be visible
 */
module.exports = (element, shouldNotBeVisible) => {
  /**
     * Visible state of the give element
     * @type {(String|Object}
     */
  const isVisible = (typeof element === 'string') ? browser.isDisplayed(element) : element.isDisplayed();

  if (shouldNotBeVisible) {
    expect(isVisible).to
      .equal(false, `Expected element "${element}" should not have been visible`);
  } else {
    expect(isVisible).to
      .equal(true, `Expected element "${element}" should have been visible`);
  }
};
