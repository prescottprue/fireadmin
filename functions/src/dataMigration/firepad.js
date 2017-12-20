import { transform } from 'babel-core'
global.window = {}
const Firepad = require('firepad')

function runBabelTransform(stringToTransform) {
  try {
    return transform(stringToTransform, { presets: ['env'] }).code
  } catch (err) {
    console.log('Error running babel transform:', err.message || err)
    throw err
  }
}

function getTextFromFirepad(firebaseRef) {
  return new Promise((resolve, reject) => {
    try {
      const headless = new Firepad.Headless(firebaseRef)
      headless.getText(text => {
        console.log('Contents of firepad retrieved: ' + text)
        resolve(text)
      })
    } catch (err) {
      console.error('Error getting contents of Firepad', err.message || err)
      reject(err)
    }
  })
}

/**
 * Get code from Firepad and run babel transform on it.
 * @param  {Object} firebaseRef - Firebase reference containing Firepad history
 * @param  {Object} options - Options object
 * @param  {Boolean} [options.enableTransform=true] - Enable babel transform
 * @return {Promise} Resolves with transformed Firepad content
 */
export async function getFirepadContent(firebaseRef, options = {}) {
  const { enableTransform = false } = options
  const text = await getTextFromFirepad(firebaseRef)
  return enableTransform ? runBabelTransform(text) : text
}
