import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { get, isUndefined } from 'lodash'
import {
  USERS_COLLECTION,
  USER_API_KEYS_SUBCOLLECTION
} from '@fireadmin/core/lib/constants/firestorePaths'
import { to } from './async'

/**
 * Get config variable from environment. Throws clear message for non existant variables.
 * @param {string} getPath - Path of config var to get from environment
 * @param {string} defaultVal - Default value to fallback to if environment config is not defined
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
 * @param  {object} functionContext - function's context
 * @returns {string} Function request's
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
 * @returns {object} Service account
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
 * @returns {object} Service account
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
 * @param {object} data - Http request from client
 */
export function validateRequest(requiredProperties, data, opts) {
  const { nonFunctionError } = opts || {}
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
    if (nonFunctionError) {
      throw new Error(errMsg)
    }
    // Throw https error (onCall HTTP function)
    throw new functions.https.HttpsError('invalid-argument', errMsg)
  }
}

/**
 * Get user based on their UID
 * @param {string} uid - Fireadmin User id
 */
async function userByUid(uid) {
  if (!uid) {
    throw new Error(`User not found for uid ${uid}`)
  }
  return admin
    .firestore()
    .doc(`${USERS_COLLECTION}/${uid}`)
    .get()
}

/**
 * Get data associated with Fireadm API key and uid
 * @param {object} settings - Api key settings
 * @param {string} settings.uid - Fireadmin uid associated with api key
 * @param {string} settings.apiKey - Fireadmin api key
 * @param {object} res - Express HTTP Response
 * @returns {Promise} Resolves with data associated with token
 */
async function getApiKeyData({ uid, apiKey }, res) {
  // Get token from users collection
  const [tokenQueryErr, tokenSnap] = await to(
    admin
      .firestore()
      .doc(
        `${USERS_COLLECTION}/${uid}/${USER_API_KEYS_SUBCOLLECTION}/${apiKey}`
      )
      .get()
  )

  // Handle errors querying Firestore
  if (tokenQueryErr) {
    console.error(
      `Error querying Firestore for uid: "${uid}" apiKey: "${apiKey}"`,
      tokenQueryErr
    )
    return res.status(500).send('Internal error')
  }

  const tokenData = tokenSnap.data()

  if (!tokenData) {
    console.error(
      `Invalid token, responding with error for uid: "${uid}" apiKey: "${apiKey}"`
    )
    return res.status(401).send('Invalid API Key')
  }

  return tokenData
}

/**
 * Express middleware for validating Fireadmin API request by
 * checking for x-fireadmin-uid and x-fireadmin-key headers
 * @param {object} req - Express HTTP Request
 * @param {object} res - Express HTTP Response
 * @param {function} next - Express HTTP Response
 * @returns {Promise} Resolves with undefined
 */
export async function validateApiRequest(req, res, next) {
  const { 'x-fireadmin-key': apiKey, 'x-fireadmin-uid': uid } = req.headers

  await getApiKeyData({ apiKey, uid }, res)

  const [getUserErr, userSnap] = await to(userByUid(uid))

  if (getUserErr || !userSnap.data()) {
    return failAndRedirectIfPossible({ res, code: 401 })
  }

  req.user = userSnap.data()

  next()
}

/**
 * Respond with error code or call redirect if it is passed
 * @param {object} options - Express HTTP Request
 * @param {number} options.code - Express HTTP Request
 * @param {string} options.redirect
 */
function failAndRedirectIfPossible({ code, res, redirect }) {
  let message = ''
  switch (code) {
    case 400:
      message = 'Bad Request'
      break
    case 401:
      message = 'Unauthorized'
      break
    case 403:
      message = 'Forbidden'
      break
    case 500:
      message = 'Server error'
      break
    default:
      message = 'Unknown error'
      break
  }
  if (redirect) {
    console.log('Redirecting to:', redirect)
    res.redirect(code, redirect).end()
  } else {
    res.status(code).send(message)
  }
}
