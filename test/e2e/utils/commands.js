import { isObject } from 'lodash'

/**
 * Converts fixture to Blob. All file types are converted to base64 then
 * converted to a Blob using Cypress expect application/json. Json files are
 * just stringified then converted to a blob (fixes issue invalid Blob issues).
 * @param {String} fileUrl - The file url to upload
 * @param {String} type - content type of the uploaded file
 * @return {Promise} Resolves with blob containing fixture contents
 */
export function getFixtureBlob(fileUrl, type) {
  return type === 'application/json'
    ? cy
        .fixture(fileUrl)
        .then(
          jsonObj =>
            new Blob([JSON.stringify(jsonObj)], { type: 'application/json' })
        )
    : cy.fixture(fileUrl, 'base64').then(Cypress.Blob.base64StringToBlob)
}

/**
 * Create command arguments string from an array of arguments by joining them
 * with a space including a leading space. If no args provided, empty string
 * is returned
 * @param  {Array} args - Command arguments to convert into a string
 * @return {String} Arguments section of command string
 */
export function getArgsString(args) {
  return args && args.length ? ` ${args.join(' ')}` : ''
}

// Path to Firebase Extra Command Line tool (wrapper for firebase-tools)
const FIREBASE_EXTRA_PATH = 'bin/firebaseExtra.js'
// Argument used to automatically approve the firebase-tools action
const FIREBASE_TOOLS_YES_ARGUMENT = '-y'
// NPX is used so that globally installed firebase-tools is used first, then
// falls back to local bin
const FIREBASE_TOOLS_BASE_COMMAND = 'npx firebase'

/**
 * Add default Firebase arguments to arguments array.
 * @param {Array} args - arguments array
 */
function addDefaultArgs(args) {
  const newArgs = [...args]
  const projectId = Cypress.env('FIREBASE_PROJECT_ID')
  // Include project id command so command runs on the current project
  if (!newArgs.includes('-P') || !newArgs.includes(projectId)) {
    newArgs.push('-P')
    newArgs.push(projectId)
  }
  // Add Firebase's automatic approval argument if it is not already in newArgs
  if (!newArgs.includes(FIREBASE_TOOLS_YES_ARGUMENT)) {
    newArgs.push(FIREBASE_TOOLS_YES_ARGUMENT)
  }
  return newArgs
}

/**
 * Build Command to run Real Time Database action. All commands call
 * firebase-tools directly, so FIREBASE_TOKEN must exist in environment.
 * @param  {String} action - action to run on Firstore (i.e. "add", "delete")
 * @param  {String} actionPath - Firestore path where action should be run
 * @param  {Any} data - Data associated with action
 * @param  {Object} [opts={}] - Options object
 * @param  {Object} opts.args - Extra arguments to be passed with command
 * @return {String} Command string to be used with cy.exec
 */
export function buildRtdbCommand(action, actionPath, data, opts = {}) {
  const { args = [] } = opts
  const argsWithDefaults = addDefaultArgs(args)
  const argsStr = getArgsString(argsWithDefaults)
  switch (action) {
    case 'remove':
      return `${FIREBASE_TOOLS_BASE_COMMAND} database:${action} /${actionPath}${argsStr}`
    case 'get': {
      const getDataArgsWithDefaults = addDefaultArgs(args, { disableYes: true })
      const getDataArgsStr = getArgsString(getDataArgsWithDefaults)
      return `${FIREBASE_TOOLS_BASE_COMMAND} database:${action} /${actionPath}${getDataArgsStr}`
    }
    default: {
      return `${FIREBASE_TOOLS_BASE_COMMAND} database:${action} /${actionPath} -d '${JSON.stringify(
        data
      )}'${argsStr}`
    }
  }
}

/**
 * Build Command to run Firestore action. Commands call either firebase-extra
 * (in bin/firebaseExtra.js) or firebase-tools directly. FIREBASE_TOKEN must
 * exist in environment if running commands that call firebase-tools.
 * @param  {String} action - action to run on Firstore (i.e. "add", "delete")
 * @param  {String} actionPath - Firestore path where action should be run
 * @param  {String|Object} fixturePath - Path to fixture. If object is passed,
 * it is used as options.
 * @param  {Object} [opts={}] - Options object
 * @param  {Object} opts.args - Extra arguments to be passed with command
 * @return {String} Command string to be used with cy.exec
 */
export function buildFirestoreCommand(
  action,
  actionPath,
  fixturePath,
  opts = {}
) {
  const options = isObject(fixturePath) ? fixturePath : opts
  const { args = [] } = options
  const argsWithDefaults = addDefaultArgs(args, { disableYes: true })
  switch (action) {
    case 'delete': {
      // Add -r to args string (recursive) if recursive option is true
      if (options.recursive) {
        argsWithDefaults.push('-r')
      }
      return `${FIREBASE_TOOLS_BASE_COMMAND} firestore:${action} ${actionPath}${getArgsString(
        argsWithDefaults
      )}`
    }
    case 'set': {
      // Add -m to argsWithDefaults string (meta) if withmeta option is true
      return `${FIREBASE_EXTRA_PATH} firestore ${action} ${actionPath} '${JSON.stringify(
        fixturePath
      )}'${options.withMeta ? ' -m' : ''}`
    }
    default: {
      // Add -m to argsWithDefaults string (meta) if withmeta option is true
      if (options.withMeta) {
        argsWithDefaults.push('-m')
      }
      return `${FIREBASE_EXTRA_PATH} firestore ${action} ${actionPath}`
    }
  }
}
