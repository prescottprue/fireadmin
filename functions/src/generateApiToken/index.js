import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { v4 } from 'uuid'
import { to } from 'utils/async'
import { contextToAuthUid, validateRequest } from 'utils/firebaseFunctions'
import { PROJECTS_COLLECTION } from '@fireadmin/core/lib/constants/firestorePaths'

/**
 * @param {Object} data - Data passed into httpsCallable by client
 * @param {Object} context - Cloud function context
 * @param {Object} context.auth - Cloud function context
 * @param {Object} context.auth.uid - UID of user that made the request
 * @param {Object} context.auth.name - Name of user that made the request
 */
export async function generateApiTokenRequest(data, context) {
  const uid = contextToAuthUid(context)
  console.log('Custom token request:', uid, { data })
  const { projectId } = data

  // Verify projectId exists
  const requiredParams = ['projectId']
  validateRequest(requiredParams, data)

  const token = v4()

  // Write token to tokens collection
  const [writeErr] = await to(
    admin
      .firestore()
      .collection(`${PROJECTS_COLLECTION}/${projectId}/tokens`)
      .add({
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: uid,
        token
      })
  )

  // Handle errors writing to Firestore
  if (writeErr) {
    console.error(
      `Error writing custom token to Firestore for project "${projectId}"`,
      writeErr
    )
    throw new functions.https.HttpsError(
      'internal',
      'Please contact Fireadmin support'
    )
  }

  return token
}

/**
 * @name generateAuthToken
 * Cloud Function triggered by HTTP request
 * @type {functions.CloudFunction}
 */
export default functions.https.onCall(generateApiTokenRequest)
