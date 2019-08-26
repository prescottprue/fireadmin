import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { v4 } from 'uuid'
import { to } from 'utils/async'
import { contextToAuthUid } from 'utils/firebaseFunctions'
import {
  USERS_COLLECTION,
  USER_API_KEYS_SUBCOLLECTION
} from '@fireadmin/core/lib/constants/firestorePaths'

/**
 * @param {object} data - Data passed into httpsCallable by client
 * @param {object} context - Cloud function context
 * @param {object} context.auth - Cloud function context
 * @param {object} context.auth.uid - UID of user that made the request
 * @param {object} context.auth.name - Name of user that made the request
 */
export async function generateApiTokenRequest(data, context) {
  const uid = contextToAuthUid(context)
  console.log('Generate API key request:', uid, data)

  const token = v4()

  // Write token to tokens collection
  const [writeErr] = await to(
    admin
      .firestore()
      .doc(`${USERS_COLLECTION}/${uid}/${USER_API_KEYS_SUBCOLLECTION}/${token}`)
      .set(
        {
          ...data,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      )
  )

  // Handle errors writing to Firestore
  if (writeErr) {
    console.error(
      `Error writing custom token to Firestore for user "${uid}"`,
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
