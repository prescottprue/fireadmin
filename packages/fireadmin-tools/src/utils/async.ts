
/**
 * Run promises in a waterfall instead of all the same time (Promise.all)
 * @param  {Array} callbacks - List of promises to run in order
 * @return {Promise} Resolves when all promises have completed in order
 */
export function promiseWaterfall(callbacks: any[]): Promise<any[]> {
  return callbacks.reduce(
    (accumulator, callback) => accumulator.then(typeof callback === 'function' ? callback : () => callback),
    Promise.resolve()
  )
}