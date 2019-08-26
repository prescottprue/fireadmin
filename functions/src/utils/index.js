import { size, pick } from 'lodash'

/**
 * Check whether or not object has all provided keys
 * @param {object} obj - Object to check for keys
 * @param {Array} keysList - Object to check for keys
 * @returns {boolean} Whether or not object has all keys
 */
export function hasAll(obj, keysList) {
  return size(pick(obj, keysList)) === size(keysList)
}
