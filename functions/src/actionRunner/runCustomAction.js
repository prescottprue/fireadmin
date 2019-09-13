import safeEval from 'safer-eval'

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
  console.log('Running custom action', options)
  const { app1, app2, step } = options
  // const { type, src, dest } = step
  // TOOD: Execute javascript that has been included within step
  const evalContext = {
    console,
    output: {}
  }
  try {
    const promiseFunc = safeEval(step.content, evalContext) // eslint-disable-line no-new-func
    console.log(
      'Type of promise func then',
      typeof promiseFunc(app1, app2, step).then
    )
    const result = await promiseFunc(app1, app2, step)
    console.log('Result', result)
    return result
  } catch (err) {
    console.error('Error parsing custom action:', err)
    throw new Error('Error parsing custom action code')
  }
}
