import * as admin from 'firebase-admin'
import { invoke } from 'lodash'
import { transform } from 'babel-core'
import safeEval from 'safe-eval'
const functions = require('firebase-functions')
global.window = {}
const Firepad = require('firepad')

const babelConfig = {
  presets: [
    [
      'env',
      {
        targets: {
          node: '6.11'
        }
      }
    ]
  ],
  plugins: ['transform-object-rest-spread']
}

/**
 * Run babel transform on a string (settings same as function babelification)
 * @param  {String} stringToTransform - String code on which to run babel
 * transform
 * @return {String} Babelified string
 */
function runBabelTransform(stringToTransform) {
  try {
    return transform(stringToTransform, babelConfig).code
  } catch (err) {
    console.log('Error running babel transform:', err.message || err)
    throw err
  }
}

/**
 * Get the text content from Firepad
 * @param  {Object} firebaseRef - Referenece to Firebase database location
 * which contains Firepad from which to load text/code.
 * @return {Promise} Resolves with the text content of the Firepad
 */
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
  const { enableTransform = true } = options
  const firepadSnap = await firebaseRef.once('value')
  const firepadSnapVal = invoke(firepadSnap, 'val')
  if (!firepadSnapVal) {
    throw new Error('No data located at provided database reference')
  }
  const text = await getTextFromFirepad(firebaseRef)
  return enableTransform ? runBabelTransform(text) : text
}

/**
 * Get code from Firepad, run babel transform on it, and invoke it within
 * function context.
 * @param  {Object} firebaseRef - Firebase reference containing Firepad history
 * @param  {Object} options - Options object
 * @param  {Boolean} [options.enableTransform=true] - Enable babel transform
 * @return {Promise} Resolves with transformed Firepad content
 */
export async function invokeFirepadContent(firebaseRef, options = {}) {
  const { context = {} } = options
  const firepadContent = await getFirepadContent(firebaseRef, options)
  if (!firepadContent) {
    console.log('No text content within Firepad')
    throw new Error('No text content within Firepad')
  }
  console.log(
    'Content loaded from Firepad. Evaluating within function context...'
  )
  // TODO: Handle removing return from the begginging of code before evaluating
  const evalContext = { console, functions, admin, output: {}, ...context }
  return safeEval(firepadContent, evalContext)
}
