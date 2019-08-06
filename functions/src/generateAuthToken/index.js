import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
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
export async function generateAuthTokenRequest(data, context) {
  const uid = contextToAuthUid(context)
  console.log('Custom token request:', uid, { data })
  const { projectId } = data

  // Verify projectId exists
  validateRequest(['projectId'], data)

  // Generate token
  const [err, token] = await to(
    admin.auth().createCustomToken(uid, { isApi: true })
  )

  // Handle errors generating token
  if (err) {
    console.error('Error generating custom token', err)
    throw err
  }

  // Write token to tokens collection
  const [writeErr] = await to(
    admin
      .firestore()
      .doc(`${PROJECTS_COLLECTION}/${projectId}/tokens`)
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
      err
    )
    throw err
  }

  return token
}

/**
 * @name generateAuthToken
 * Cloud Function triggered by HTTP request
 * @type {functions.CloudFunction}
 */
export default functions.https.onCall(generateAuthTokenRequest)
