import * as admin from 'firebase-admin'
import { get } from 'lodash'
import request from 'request-promise'
import google from 'googleapis'
import { serviceAccountFileFromStorage } from '../utils/serviceAccounts'
import { eventPathName, SCOPES } from './constants'

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
      // tokens is second arg
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
  console.log('Request recieved', eventVal)
  if (!eventVal) {
    console.error('No event value?')
    throw new Error('No value contained within event')
  }
  const {
    api = 'storage',
    method = 'GET',
    body,
    apiVersion = 'v1',
    suffix = eventVal.suffix || `b/${eventVal.storageBucket}`,
    serviceAccount: { fullPath }
  } = eventVal
  try {
    const serviceAccount = await serviceAccountFileFromStorage(
      fullPath,
      `callGoogleApi/${eventId}/${Date.now()}`
    )
    const response = await googleApisRequest(serviceAccount, {
      method,
      uri: `https://www.googleapis.com/${api}/${apiVersion}/${suffix}?cors`,
      body,
      headers: {
        'Gdata-Version': '3.0'
      },
      json: true
    })
    console.log('Google API response successful. Writing response to RTDB...')
    await event.data.adminRef.ref.root
      .child(`responses/${eventPathName}/${eventId}`)
      .set({
        completed: true,
        responseData: response,
        completedAt: admin.database.ServerValue.TIMESTAMP
      })
    console.log('Success! Response data written to RTDB. Exiting.')
    return response
  } catch (err) {
    console.log('Error calling Google API:', err.message || err)
    await event.data.adminRef.ref.root
      .child(`responses/${eventPathName}/${eventId}`)
      .set({
        completed: true,
        error: err.message || JSON.stringify(err),
        completedAt: admin.database.ServerValue.TIMESTAMP
      })
    throw err
  }
}
