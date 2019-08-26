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

function userByUid(uid) {
  if (!uid) {
    throw new Error(`User not found for uid ${uid}`)
  }
  return admin
    .firestore()
    .doc(`${USERS_COLLECTION}/${uid}`)
    .get()
}

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

export async function validateApiRequest(req, res, next) {
  const { 'x-fireadmin-key': apiKey, 'x-fireadmin-uid': uid } = req.headers
  console.log('request headers:', req.headers)
  console.log('request body:', req.body)

  await getApiKeyData({ apiKey, uid }, res)

  const [getUserErr, userSnap] = await to(userByUid(uid))

  if (getUserErr || !userSnap.data()) {
    return failAndRedirectIfPossible({ res, code: 401 })
  }

  req.user = userSnap.data()

  next()
}

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

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
export async function validateFirebaseIdToken(req, res, next) {
  const { redirect } = req.query
  const authorizationHeadersExist = !!req.headers.authorization
  const hasBearerIdentifier =
    authorizationHeadersExist && req.headers.authorization.startsWith('Bearer ')
  const { idToken: queryIdToken } = req.query || {}
  console.log('Check if request is authorized with Firebase ID token')
  if (!hasBearerIdentifier && !req.cookies.__session && !queryIdToken) {
    console.error(
      'No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie',
      'or by passing an idToken query param.'
    )
    return failAndRedirectIfPossible({ res, redirect, code: 401 })
  }

  let idToken
  if (hasBearerIdentifier) {
    console.log('Found "Authorization" header')
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1]
  } else if (queryIdToken) {
    console.log('Found idToken query param')
    idToken = queryIdToken
  } else {
    console.log('Found "__session" cookie')
    // Read the ID Token from cookie.
    idToken = req.cookies.__session
  }
  return admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedIdToken => {
      console.log('ID Token correctly decoded', decodedIdToken)
      req.user = decodedIdToken
      next()
    })
    .catch(error => {
      console.error('Error while verifying Firebase ID token:', error)
      return failAndRedirectIfPossible({ res, redirect, code: 401 })
    })
}
