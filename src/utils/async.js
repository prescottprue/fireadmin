/**
 * Async await wrapper for easy error handling
 * @param  {Promise} promise - Promise to wrap responses of
 * @return {Promise} Resolves and rejects with an array
 */
export function to(promise) {
  return promise.then(data => [null, data]).catch(err => [err])
}

/**
 * Run promises in a waterfall instead of all the same time (Promise.all)
 * @param  {Array} callbacks - List of promises to run in order
 * @return {Promise} Resolves when all promises have completed in order
 */
export function promiseWaterfall(callbacks) {
  return callbacks.reduce(
    (accumulator, callback) => accumulator.then(callback),
    Promise.resolve()
  )
}

export default { to, promiseWaterfall }
