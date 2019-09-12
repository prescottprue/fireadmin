/**
 * Get code from Firepad, run babel transform on it, and invoke it within
 * function context.
 * @param {Object} options - Firebase reference containing Firepad history
 * @param {Object} options.app1 - First Firebase app
 * @param {Object} options.app2 - Second Firebase app
 * @param {Object} options - Options object
 * @param {Boolean} [options.enableTransform=true] - Enable babel transform
 * @returns {Promise} Resolves with transformed Firepad content
 */
export default async function runCustomAction(options) {
  console.log('Running custom action')
  const { app1, app2, step } = options
  // const { type, src, dest } = step
  // TOOD: Execute javascript that has been included within step
  const evalContext = {
    console: { log: console.log, warn: console.warn, error: console.error },
    output: {}
  }
  console.log('Before', evalContext)
  try {
    const promiseString = new Function(`return ${step.content}`)() // eslint-disable-line no-new-func
    const result = await promiseString(app1, app2, step)
    console.log('Result', result)
    return result
  } catch (err) {
    console.error('Error parsing custom action:', err)
    throw new Error('Error parsing custom action code')
  }
}
