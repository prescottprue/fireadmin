import * as functions from 'firebase-functions'
import { getAppFromServiceAccount } from '../utils/serviceAccounts'
import { dataArrayFromSnap } from '../utils/firestore'

/**
 * @param {Object} data - Data passed into httpsCallable by client
 * @param {Object} context - Cloud function context
 * @param {Object} context.auth - Cloud function context
 * @param {Object} context.auth.uid - UID of user that made the request
 * @param {Object} context.auth.name - Name of user that made the request
 */
export async function environmentDataViewerRequest(data, context) {
  console.log('Environment data viewer request:', data)
  const { projectId } = data
  // TODO: Confirm user has rights to this environment/serviceAccount
  // Get app from service account (loaded from project)
  const app = await getAppFromServiceAccount(data, { projectId })
  // TODO: Make this dynamice to a number of resources
  const topLevelResource = app[data.resource]() // database/firestore/etc
  // TODO: Support multiple levels of query
  const query =
    data.resource === 'firestore'
      ? topLevelResource.collection('projects').get()
      : topLevelResource.ref('projects').once('value')
  const dataSnap = await query
  const results = dataArrayFromSnap(dataSnap)
  return results
}

/**
 * @name environmentDataViewer
 * Cloud Function triggered by HTTP request
 * @type {functions.CloudFunction}
 */
export default functions.https.onCall(environmentDataViewerRequest)
