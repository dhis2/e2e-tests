/**
 * Check if the given element exists in the DOM one or more times
 * @param  {String}  element  Element selector
 * @param  {Boolean} falseCase Check if the element (does not) exists
 * @param  {Number}  exactly  Check if the element exists exactly this number
 *                            of times
 */
module.exports = (element, falseCase, exactly) => {
  const elements = browser.$$(element);
  if (falseCase === true) {
    expect(elements).to.have.lengthOf(
      0,
      `Element with selector "${element}" should not exist on the page`
    );
  } else if (exactly) {
    expect(elements).to.have.lengthOf(
      exactly,
      `Element with selector "${element}" should exist exactly ` +
      `${exactly} time(s)`
    );
  } else {
    expect(elements).to.have.length.of.at.least(
      1,
      `Element with selector "${element}" should exist on the page`
    );
  }
};
