import * as functions from 'firebase-functions'

/**
 * @param {Object} data - Data passed into httpsCallable by client
 * @param {Object} context - Cloud function context
 * @param {Object} context.auth - Cloud function context
 * @param {Object} context.auth.uid - UID of user that made the request
 * @param {Object} context.auth.name - Name of user that made the request
 */
export async function environmentDataToolRequest(data, context) {
  // TODO: Confirm user has rights to this environment/serviceAccount
  // TODO: Get service account based on project settings
  return { message: 'Hello World' }
}

/**
 * @name environmentDataTool
 * Cloud Function triggered by HTTP request
 * @type {functions.CloudFunction}
 */
export default functions.https.onCall(environmentDataToolRequest)
