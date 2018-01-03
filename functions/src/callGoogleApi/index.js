import { invoke, get } from 'lodash'
import request from 'request-promise'
import { serviceAccountFromStoragePath } from '../utils/serviceAccounts'
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
const authClientFromServiceAccount = serviceAccount => {
  console.log('auth client from service account')
  if (jwtClient) {
    return Promise.resolve(jwtClient)
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
const addServiceAccountAuthToRequest = (serviceAccount, requestSettings) => {
  const client = authClientFromServiceAccount(serviceAccount)
  const request = requestSettings
  request.auth = client
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
  console.log('Google API requests request')
  const requestSettingsWithAuth = await addServiceAccountAuthToRequest(
    serviceAccount,
    requestSettings
  )
  return new Promise((resolve, reject) => {
    request(requestSettingsWithAuth, (err, response) => {
      if (err) {
        console.error(`${name} request had an error`, err)
        return reject(err)
      }
      console.log(`${name} request completed successfully`, response)
      return resolve(response)
    })
  })
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
  const eventData = invoke(get(event, 'data'), 'val')
  console.log('call google api event data', eventData)
  const {
    api = 'storage',
    body = { cors: [{ origin: 'http://mytest.com' }] },
    suffix = `b/${functions.config().firebase.storageBucket}`,
    serviceAccount: { fullPath }
  } = event.data.val()
  console.log('getting service account from path', fullPath)
  const serviceAccount = await serviceAccountFromStoragePath(fullPath)
  return googleApisRequest(serviceAccount, {
    method: 'PUT',
    uri: `https://www.googleapis.com/${api}/v1/${suffix}?alt=json`,
    body,
    json: true
  })
}
