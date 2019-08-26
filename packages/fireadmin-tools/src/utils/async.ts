/**
 * Async await wrapper for easy error handling
 * @param promise - Promise to wrap responses of
 * @return Resolves and rejects with an array
 * @memberof utils
 * @example <caption>Basic</caption>
 * import { to } from 'utils/async'
 *
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
export function to<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object
): Promise<[U | null, T | undefined]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        Object.assign(err, errorExt)
      }

      return [err, undefined]
    })
}

/**
 * Run promises in a waterfall instead of all the same time (Promise.all). Supports
 * passing a Promise or passing a function which recives the previous step's value
 * and returns a promise.
 * @param callbacks - List of promises or functions that
 * return promises to run in order
 * @return Resolves when all promises have completed in order
 */
export function promiseWaterfall(callbacks: any[]): Promise<any[]> {
  return callbacks.reduce((accumulator: Promise<any>, callback) => {
    // Add promise to chain (handling both functions and promises)
    return accumulator.then(
      typeof callback === 'function' ? callback : () => callback
    )
  }, Promise.resolve())
}
