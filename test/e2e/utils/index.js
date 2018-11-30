export function createSelector(selectorValue) {
  return `[data-test=${selectorValue}]`
}

export function createIdSelector(selectorValue) {
  return `[data-test-id=${selectorValue}]`
}
