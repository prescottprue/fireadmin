const { NodeVM } = require('vm2')

const vm = new NodeVM({
  console: 'inherit',
  sandbox: {
    output: {}
  },
  eval: false,
  wasm: false,
  require: {
    external: true,
    builtin: ['path']
  }
})

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
  try {
    const functionWithCallbackInSandbox = vm.run(step.content)
    if (
      !functionWithCallbackInSandbox ||
      typeof functionWithCallbackInSandbox.default !== 'function'
    ) {
      const invalidExportErrMsg =
        'Custom action must export a default function which returns a promise'
      console.error(invalidExportErrMsg)
      throw new Error(invalidExportErrMsg)
    }
    const result = await functionWithCallbackInSandbox.default(
      [app1, app2],
      step.inputValues,
      step
    )
    console.log('Result', result)
    return result
  } catch (err) {
    console.error('Error parsing custom action:', err)
    throw new Error('Error parsing custom action code')
  }
}
