/**
 * Async await wrapper for easy error handling
 * @param promise - Promise to wrap responses of
 * @returns Resolves and rejects with an array
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
export function to(promise: Promise<any>): Promise<any> {
  return promise.then((data) => [null, data]).catch((err) => [err, undefined])
}

/**
 * Run promises in a waterfall instead of all the same time (Promise.all)
 * @param callbacks - List of promises to run in order
 * @returns Resolves when all promises have completed in order
 */
export function promiseWaterfall(callbacks: any[]): Promise<any> {
  return callbacks.reduce(
    (accumulator, callback) =>
      accumulator.then(
        typeof callback === 'function' ? callback : () => callback
      ),
    Promise.resolve()
  )
}
