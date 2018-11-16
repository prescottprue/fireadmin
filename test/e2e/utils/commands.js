import { isObject, isBoolean } from 'lodash'

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
const BASE_FIXTURE_PATH = 'test/e2e/fixtures'

/**
 * Add default Firebase arguments to arguments array.
 * @param {Array} args - arguments array
 * @param  {Object} [opts={}] - Options object
 * @param {Boolean} [opts.disableYes=false] - Whether or not to disable the
 * yes argument
 */
function addDefaultArgs(args, opts = {}) {
  const { disableYes = false } = opts
  const newArgs = [...args]
  const projectId = Cypress.env('FIREBASE_PROJECT_ID')
  // Include project id command so command runs on the current project
  if (!newArgs.includes('-P') || !newArgs.includes(projectId)) {
    newArgs.push('-P')
    newArgs.push(projectId)
  }
  // Add Firebase's automatic approval argument if it is not already in newArgs
  if (!disableYes && !newArgs.includes(FIREBASE_TOOLS_YES_ARGUMENT)) {
    newArgs.push(FIREBASE_TOOLS_YES_ARGUMENT)
  }
  return newArgs
}

/**
 * Build Command to run Real Time Database action. All commands call
 * firebase-tools directly, so FIREBASE_TOKEN must exist in environment.
 * @param  {String} action - action to run on Firstore (i.e. "add", "delete")
 * @param  {String} actionPath - Firestore path where action should be run
 * @param  {String|Object} fixturePath - Path to fixture. If object is passed,
 * it is used as options.
 * @param  {Object} [opts={}] - Options object
 * @param  {Object} opts.args - Extra arguments to be passed with command
 * @return {String} Command string to be used with cy.exec
 */
export function buildRtdbCommand(action, actionPath, fixturePath, opts = {}) {
  const options = isObject(fixturePath) ? fixturePath : opts
  const { args = [] } = options
  const argsWithDefaults = addDefaultArgs(args)
  const argsStr = getArgsString(argsWithDefaults)
  switch (action) {
    case 'delete':
      return `${FIREBASE_TOOLS_BASE_COMMAND} database:${action} ${actionPath}${argsStr}`
    case 'get': {
      const getDataArgsWithDefaults = addDefaultArgs(args, { disableYes: true })
      if (options.limitToLast) {
        const lastCount = isBoolean(options.limitToLast)
          ? 1
          : options.limitToLast
        if (!options.orderByChild) {
          getDataArgsWithDefaults.push(
            `--order-by-key --limit-to-last ${lastCount}`
          )
        } else {
          getDataArgsWithDefaults.push(
            `--order-by-child ${
              options.orderByChild
            } --limit-to-last ${lastCount}`
          )
        }
      }
      const getDataArgsStr = getArgsString(getDataArgsWithDefaults)
      return `${FIREBASE_TOOLS_BASE_COMMAND} database:${action} /${actionPath}${getDataArgsStr}`
    }
    default: {
      const fullPathToFixture = `${BASE_FIXTURE_PATH}/${fixturePath}`
      return `${FIREBASE_TOOLS_BASE_COMMAND} database:${action} /${actionPath} ${fullPathToFixture}${argsStr}`
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
      const deleteArgsWithDefaults = addDefaultArgs(args)
      // Add -r to args string (recursive) if recursive option is true otherwise specify shallow
      const finalDeleteArgs = deleteArgsWithDefaults.concat(
        options.recursive ? '-r' : '--shallow'
      )
      const deleteArgsStr = getArgsString(finalDeleteArgs)
      return `${FIREBASE_TOOLS_BASE_COMMAND} firestore:${action} ${actionPath}${deleteArgsStr}`
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
