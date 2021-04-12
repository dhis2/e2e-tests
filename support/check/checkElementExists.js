import checkIfElementExists from './checkIfElementExists';

/**
 * Check if the given element exists
 * @param  {String}   elem       Element selector
 * @param  {Boolean}   isExisting Whether the element should be existing or not
 *                               
 */
module.exports = (elem, isExisting) => {
  checkIfElementExists(elem, isExisting);
};
