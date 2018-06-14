import * as admin from 'firebase-admin'
import { get, uniqueId } from 'lodash'
import request from 'request-promise'
import google from 'googleapis'
import { serviceAccountFromFirestorePath } from '../utils/serviceAccounts'
import { eventPathName, SCOPES } from './constants'
import { to } from '../utils/async'

let jwtClient = null

/**
 * Get Google APIs auth client. Auth comes from serviceAccount.
 * @return {Promise} Resolves with JWT Auth Client (for attaching to request)
 */
async function authClientFromServiceAccount(serviceAccount) {
  if (
    !get(serviceAccount, 'client_email') ||
    !get(serviceAccount, 'private_key')
  ) {
    throw new Error('Invalid service account')
  }
  if (jwtClient) {
    return jwtClient
  }
  jwtClient = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    SCOPES
  )
  return new Promise((resolve, reject) => {
    jwtClient.authorize(err => {
      if (!err) {
        google.options({ auth: jwtClient })
        resolve(jwtClient)
      } else {
        console.error(
          'Error authorizing with Service Account',
          err.message || err
        )
        reject(err)
      }
    })
  })
}

/**
 * Add authentication to a google request using serviceAccount
 * @param  {Object}  requestWithoutAuth - Request object without auth
 * @return {Promise} Resolves with request that has auth attached
 */
async function addServiceAccountAuthToRequest(serviceAccount, requestSettings) {
  const client = await authClientFromServiceAccount(serviceAccount)
  return {
    ...requestSettings,
    headers: {
      Authorization: `${client.credentials.token_type} ${
        client.credentials.access_token
      }`
    }
  }
}

/**
 * Request google APIs with auth attached
 * @param  {Function}  method - Google APIs method to call
 * @param  {String}  name - Name of the method (used in console messaging)
 * @param  {Object}  requestSettings - Settings for request
 * @return {Promise} Resolves with results of Goggle API request
 */
export async function googleApisRequest(serviceAccount, requestSettings) {
  const requestSettingsWithAuth = await addServiceAccountAuthToRequest(
    serviceAccount,
    requestSettings
  )
  try {
    const response = await request(requestSettingsWithAuth)
    console.log(`Google API Request completed successfully`, response)
    return response
  } catch (err) {
    console.error(`Google API Responded with an error: \n`, err.message || err)
    throw err
  }
}

/**
 * Call a Google API with a Service Account
 * @param  {[type]} event - Functions event
 * @return {Promise} Resolves with results of calling Google API
 */
export default async function callGoogleApi(snap, context) {
  const eventVal = snap.val()
  const eventId = get(context, 'params.pushId')
  const {
    api = 'storage',
    method = 'GET',
    body,
    apiVersion = 'v1',
    suffix = `b/${eventVal.storageBucket}`,
    storageBucket,
    projectId,
    environment
  } = eventVal
  const responseRef = admin
    .database()
    .ref(`responses/${eventPathName}/${eventId}`)

  // Handle missing parameters
  if (!projectId || !environment || !storageBucket) {
    const missingMsg =
      'projectId, environment, and storageBucket are required parameters'
    console.error(missingMsg)
    const missingParamsErr = new Error(missingMsg)
    await responseRef.set({
      completed: true,
      error: missingMsg,
      completedAt: admin.database.ServerValue.TIMESTAMP
    })
    throw missingParamsErr
  }
  const appName = `app-${uniqueId()}`
  console.log(
    'Searching for service account from: ',
    `projects/${projectId}/environments/${environment}`
  )

  // Get Service Account object by decryping string from Firestore
  const [getSAErr, serviceAccount] = await to(
    serviceAccountFromFirestorePath(
      `projects/${projectId}/environments/${environment}`,
      appName,
      { returnData: true }
    )
  )

  // Handle errors getting service account
  if (getSAErr || !serviceAccount) {
    console.error('Error getting service account:', getSAErr)
    const missingParamsErr = getSAErr
    await responseRef.set({
      completed: true,
      error: getSAErr.message || getSAErr,
      completedAt: admin.database.ServerValue.TIMESTAMP
    })
    throw missingParamsErr
  }

  const uri = `https://www.googleapis.com/${api}/${apiVersion}/${suffix}?cors`
  // Call Google API with service account
  const [err, response] = await to(
    googleApisRequest(serviceAccount, {
      method,
      uri,
      body,
      headers: {
        'Gdata-Version': '3.0'
      },
      json: true
    })
  )

  // Handle errors calling Google API
  if (err) {
    console.error(`Error calling Google API: ${uri}`, err.message || err)
    await responseRef.set({
      completed: true,
      error: err.message || JSON.stringify(err),
      completedAt: admin.database.ServerValue.TIMESTAMP
    })
    throw err
  }

  console.log('Google API responsed successfully. Writing response to RTDB...')
  await responseRef.set({
    completed: true,
    responseData: response,
    completedAt: admin.database.ServerValue.TIMESTAMP
  })

  console.log('Success! Response data written to RTDB. Exiting.')
  return response
}
