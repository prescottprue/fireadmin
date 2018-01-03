import { invoke, get } from 'lodash'
import request from 'request-promise'
import { serviceAccountFileFromStorage } from '../utils/serviceAccounts'
const functions = require('firebase-functions')
const google = require('googleapis')

const SCOPES = [
  'https://www.googleapis.com/auth/devstorage.full_control',
  'https://www.googleapis.com/auth/cloud-platform'
]
let jwtClient = null

const eventPathName = 'googleApi'

/**
 * Get Google APIs auth client. Auth comes from serviceAccount.
 * @return {Promise} Resolves with JWT Auth Client (for attaching to request)
 */
const authClientFromServiceAccount = async serviceAccount => {
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
const addServiceAccountAuthToRequest = async (
  serviceAccount,
  requestSettings
) => {
  const client = await authClientFromServiceAccount(serviceAccount)
  const request = {
    ...requestSettings,
    headers: {
      Authorization: `${client.credentials.token_type} ${
        client.credentials.access_token
      }`
    }
  }
  return request
}

/**
 * Request google APIs with auth attached
 * @param  {Function}  method - Google APIs method to call
 * @param  {String}  name - Name of the method (used in console messaging)
 * @param  {Object}  requestSettings - Settings for request
 * @return {Promise} Resolves with results of Goggle API request
 */
export const googleApisRequest = async (serviceAccount, requestSettings) => {
  const requestSettingsWithAuth = await addServiceAccountAuthToRequest(
    serviceAccount,
    requestSettings
  )
  try {
    const response = await request(requestSettingsWithAuth)
    console.log(`Google API Request completed successfully`, response)
  } catch (err) {
    console.error(`Google API Responded with an error: \n`, err.message || err)
    throw err
  }
}

/**
 * @name callGoogleApi
 * Convert a JSON file from storage bucket into a data on RTDB
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref(`/requests/${eventPathName}/{pushId}`)
  .onCreate(callGoogleApi)

async function callGoogleApi(event) {
  console.log('call google api', event)
  const eventData = get(event, 'data')
  const eventVal = invoke(eventData, 'val')
  const {
    api = 'storage',
    method = 'GET',
    body,
    suffix = `b/${functions.config().firebase.storageBucket}`,
    serviceAccount: { fullPath }
  } = eventVal
  const serviceAccount = await serviceAccountFileFromStorage(
    fullPath,
    get(event, 'params.pushId', 'nope')
  )
  return googleApisRequest(serviceAccount, {
    method,
    uri: `https://www.googleapis.com/${api}/v1/${suffix}?cors`,
    body,
    headers: {
      'Gdata-Version': '3.0'
    },
    json: true
  })
}
