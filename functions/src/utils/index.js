import { size, pick } from 'lodash'

/**
 * Check object for all keys
 * @param {object} obj - Object to check for keys
 * @param {Array} keysList - List of keys to check for in object
 * @returns {boolean} Whether or not object has all keys
 */
export function hasAll(obj, keysList) {
  return size(pick(obj, keysList)) === size(keysList)
}
