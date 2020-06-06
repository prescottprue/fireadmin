import request from 'request-promise'
import { uniqueId } from 'lodash'
import { to } from './async'
import {
  authClientFromServiceAccount,
  serviceAccountFromFirestorePath
} from './serviceAccounts'

/**
 * Request google APIs with auth attached
 * @param {object} opts - Google APIs method to call
 * @param {string} opts.projectId - Id of fireadmin project
 * @param {string} opts.environmentId - Id of fireadmin environment
 * @param {string} opts.databaseName - Name of database on which to run (defaults to project base DB)
 * @param {string} rtdbPath - Path of RTDB data to get
 * @returns {Promise} Resolves with results of RTDB shallow get
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

  if (typeof response === 'string' || response instanceof String) {
    return JSON.parse(response)
  }

  return response
}
