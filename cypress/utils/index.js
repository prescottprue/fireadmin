/**
 * Create selector for data-test attribute value
 * @param {String} selectorValue - Value of selector
 * @return {String} String containing selector and value
 */
export function createSelector(selectorValue) {
  return `[data-test=${selectorValue}]`
}

/**
 * Create selector for data-test-id attribute value
 * @param {String} selectorValue - Value of selector
 * @return {String} String containing selector and value
 */
export function createIdSelector(selectorValue) {
  return `[data-test-id=${selectorValue}]`
}

/**
 * Create selector for data-test-value attribute value
 * @param {String} selectorValue - Value of selector
 * @return {String} String containing selector and value
 */
export function createValueSelector(selectorValue) {
  return `[data-test-value=${selectorValue}]`
}
