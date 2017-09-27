/**
 * Check if the given element is (not) visible
 * @param  {String}   element   Element selector
 * @param  {Object}   element   WebElement JSON object
 * @param  {String}   falseCase Check for a visible or a hidden element
 */
module.exports = (element, falseCase) => {
    /**
     * Visible state of the give element
     * @type {(String|Object}
     */
    const isVisible = (typeof element === 'string') ? browser.isVisible(element) : element.isVisible();

    if (falseCase) {
        expect(isVisible).to.not
            .equal(true, `Expected element "${element}" not to be visible`);
    } else {
        expect(isVisible).to
            .equal(true, `Expected element "${element}" to be visible`);
    }
};
