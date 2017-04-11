/**
 * Given an object, returns whether it is empty or not
 * param {Object} obj
 * return {boolean} true if empty, false if not 
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
}
