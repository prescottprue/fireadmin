import request from 'request-promise'
const functions = require('firebase-functions')

const eventPathName = 'googleApi'

/**
 * @name callGoogleApi
 * Convert a JSON file from storage bucket into a data on RTDB
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref(`/requests/${eventPathName}/{pushId}`)
  .onCreate(callGoogleApi)

async function callGoogleApi(event) {
  const {
    api = 'storage',
    body,
    accessToken,
    suffix = `b/${functions.config().firebase.storageBucket}`
  } = event
  return request({
    method: 'PUT',
    uri: `https://www.googleapis.com/${api}/v1/${suffix}?alt=json`,
    body,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Gdata-Version': '3.0'
    },
    json: true
  })
}
