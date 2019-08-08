import * as functions from 'firebase-functions'
import { get, isUndefined } from 'lodash'

/**
 * Get config variable from environment. Throws clear message for non existant variables.
 * @param {String} getPath - Path of config var to get from environment
 * @param {String} defaultVal - Default value to fallback to if environment config is not defined
 * @example <caption>Basic</caption>
 * const asanaConfig = getEnvConfig('asana') // functions.config().asana
 * @example <caption>Deep Value</caption>
 * const asanaConfig = getEnvConfig('asana') // functions.config().asana.token
 * @memberof utils
 */
export function getEnvConfig(getPath, defaultVal) {
  if (!getPath) {
    console.warn(
      'Getting top level config can cause things to break, pass a get path to getEnvConfig'
    )
    return functions.config()
  }
  const varValue = get(functions.config(), getPath) || defaultVal
  if (isUndefined(varValue)) {
    throw new Error(
      `${getPath} functions config variable not set, check functions/.runtimeconfig.json`
    )
  }
  return varValue
}

/**
 * Convert function context to the currently logged in user's uid falling back
 * to "Unknown". If admin user is logged in uid will be 'admin'.
 * @param  {Object} functionContext - function's context
 * @return {String} Function request's
 */
export function contextToAuthUid(functionContext = {}) {
  if (functionContext.authType === 'ADMIN') {
    return 'admin'
  }
  return (functionContext.auth && functionContext.auth.uid) || 'Unknown'
}

/**
 * Get service account from functions config. Throws if service account
 * functions variable does not exist
 * @return {Object} Service account
 * @example Basic
 * const serviceAccount = getLocalServiceAccount()
 * Object.keys(serviceAccount)
 * // => [
 * // 'private_key_id', 'client_x509_cert_url', 'client_id', 'token_uri',
 * // 'auth_provider_x509_cert_url', 'client_email', 'project_id',
 * // 'auth_uri', 'type', 'private_key'
 * // ]
 */
export function getLocalServiceAccount() {
  if (!functions.config().service_account) {
    throw new Error(
      '"service_account" functions config variable not set, check functions/.runtimeconfig.json'
    )
  }
  return functions.config().service_account
}

/**
 * Get the firebase config of the current functions environment
 * @return {Object} Service account
 * @example Basic
 * getFirebaseConfig()
 * // => {
 * //   databaseURL: 'https://databaseName.firebaseio.com',
 * //   storageBucket: 'projectId.appspot.com',
 * //   projectId: 'projectId'
 * // }
 * @example Get Value
 * getFirebaseConfig('projectId')
 * // => "myProject"
 */
export function getFirebaseConfig(getPath, defaultVal) {
  let fbConfig
  try {
    fbConfig = JSON.parse(process.env.FIREBASE_CONFIG)
    if (!getPath) {
      return fbConfig
    }
    return fbConfig[getPath]
  } catch (err) {
    console.error('Error getting Firebase config:', err)
    throw err
  }
}

/**
 * Validate user request
 * @param {Array} requiredProperties - List of required properties
 * @param {Object} data - Http request from client
 */
export function validateRequest(requiredProperties, data, res) {
  const missingRequired = requiredProperties.filter(
    propName => !get(data, propName)
  )

  // Handle parameter not being within request
  if (missingRequired && missingRequired.length) {
    const missingParamsStr = missingRequired.join(', ')
    const missingParamsMsg = `Request missing parameter(s): ${missingParamsStr}`
    console.error(missingParamsMsg)

    // Write http response if response object exists (normal HTTP function, not onCall)
    const errMsg = `Request missing required parameters: ${missingParamsStr}`
    if (res) {
      res.status(400).send(errMsg)
      throw new Error(errMsg)
    }
    // Throw https error (onCall HTTP function)
    throw new functions.https.HttpsError('invalid-argument', errMsg)
  }
}
