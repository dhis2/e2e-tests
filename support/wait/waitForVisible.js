/**
 * Wait for the given element to become visible
 * @param  {String}   elem      Element selector
 * @param  {String}   reverse   Whether or not to expect a visible or hidden
 *                              state
 *
 * @todo  merge with waitfor
 */
module.exports = (elem, reverse) => {
  /**
   * Maximum number of milliseconds to wait for
   * @type {Int}
   */
  const ms = 10000;
  elem.waitForDisplayed(ms, {reverse: reverse});
};
