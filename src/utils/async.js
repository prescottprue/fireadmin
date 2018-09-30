/**
 * Async await wrapper for easy error handling
 * @param  {Promise} promise - Promise to wrap responses of
 * @return {Promise} Resolves and rejects with an array
 * @example
 * async function asyncFunctionWithThrow() {
 *  const [err, snap] = await to(
 *    admin.database().ref('some').once('value')
 *  );
 *  if (err) {
 *    console.error('Error getting data:', err.message || err)
 *    throw err
 *  }
 *  if (!snap.val()) throw new Error('Data not found');
 *  console.log('Data found:', snap.val())
 * }
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
