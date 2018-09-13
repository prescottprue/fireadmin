import * as functions from 'firebase-functions'

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
  if (functionContext.authType === 'USER') {
    return functionContext.auth.uid
  }
  return 'Unknown'
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
