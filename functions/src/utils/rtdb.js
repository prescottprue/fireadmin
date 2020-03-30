import * as admin from 'firebase-admin'
import request from 'request-promise'
import { isString, uniqueId } from 'lodash'
import { to } from './async'
import {
  authClientFromServiceAccount,
  serviceAccountFromFirestorePath
} from './serviceAccounts'

/**
 * Create a reference to Real Time Database at a provided path. Uses credentials
 * of Cloud Functions.
 * @param  {String} refPath - path for database reference
 * @return {firebase.Database.Reference} Database reference for provided path
 */
export function rtdbRef(refPath) {
  return admin.database().ref(refPath)
}

/**
 * Watch a snapshot location for completed: true. Also handles errors.
 * @param  {Object} snap - Snapshot which to watch for completed flag
 * @return {Promise} Resolves with request snapshot after completed === true
 */
export function waitForValue(ref) {
  return new Promise((resolve, reject) => {
    const EVENT_TYPE = 'value'
    let requestListener
    requestListener = ref.on(
      EVENT_TYPE,
      (responseSnap) => {
        if (responseSnap.val()) {
          const requestVal = responseSnap.val()
          // reject if watching request errors out
          if (requestVal.status === 'error' || requestVal.error) {
            reject(responseSnap.val().error)
          } else {
            // Unset listener
            ref.off(EVENT_TYPE, requestListener)
            resolve(responseSnap)
          }
        }
      },
      (err) => {
        console.error(`Error waiting for value at path: ${ref.path}`, err)
        reject(err)
      }
    )
  })
}

/**
 * Request google APIs with auth attached
 * @param  {Object}  opts - Google APIs method to call
 * @param  {String}  opts.projectId - Id of fireadmin project
 * @param  {String}  opts.environmentId - Id of fireadmin environment
 * @param  {String}  opts.databaseName - Name of database on which to run (defaults to project base DB)
 * @param  {String}  rtdbPath - Path of RTDB data to get
 * @return {Promise} Resolves with results of RTDB shallow get
 */
export async function shallowRtdbGet(opts, rtdbPath = '') {
  const { projectId, environmentId, databaseName } = opts
  if (!environmentId) {
    throw new Error(
      'environmentId is required for action to authenticate through serviceAccount'
    )
  }
  console.log(`Getting service account from Firestore...`)

  // Make unique app name (prevents issue of multiple apps initialized with same name)
  const appName = `${environmentId}-${uniqueId()}`
  // Get Service account data from resource (i.e Storage, Firestore, etc)
  const [saErr, serviceAccount] = await to(
    serviceAccountFromFirestorePath(
      `projects/${projectId}/environments/${environmentId}`,
      appName,
      { returnData: true }
    )
  )

  if (saErr) {
    console.error(
      `Error getting service account: ${saErr.message || ''}`,
      saErr
    )
    throw saErr
  }

  const client = await authClientFromServiceAccount(serviceAccount)

  const apiUrl = `https://${
    databaseName || serviceAccount.project_id
  }.firebaseio.com/${rtdbPath}.json?access_token=${
    client.credentials.access_token
  }&shallow=true`

  const [getErr, response] = await to(request(apiUrl))

  if (getErr) {
    console.error(
      `Firebase REST API errored when calling path "${rtdbPath}" for environment "${projectId}/${environmentId}" : ${
        getErr.statusCode
      } \n ${getErr.error ? getErr.error.message : ''}`
    )
    throw getErr.error || getErr
  }
  if (isString(response)) {
    return JSON.parse(response)
  }
  return response
}
