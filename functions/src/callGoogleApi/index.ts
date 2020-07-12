import * as functions from 'firebase-functions'
import callGoogleApi from './callGoogleApi'
import { eventPathName } from './constants'

/**
 * @name callGoogleApi
 * Call a Google API with a Service Account
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref(`/requests/${eventPathName}/{pushId}`)
  .onCreate(callGoogleApi)
