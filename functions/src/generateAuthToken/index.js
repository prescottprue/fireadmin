import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {
  USERS_COLLECTION,
  USER_API_KEYS_SUBCOLLECTION
} from '@fireadmin/core/lib/constants/firestorePaths'
import { to } from 'utils/async'
import { validateRequest } from 'utils/firebaseFunctions'

/**
 * Generate auth token from API key
 * @param req - Express HTTP Request
 * @param res - Express HTTP Response
 */
export async function generateAuthTokenRequest(req, res) {
  const requestData = req.body || {}
  console.log('Custom token request:', requestData)

  // Verify projectId exists
  const requiredParams = ['uid']
  validateRequest(requiredParams, requestData, res)

  const { apiKey, uid } = requestData

  // Get token from users collection
  const [tokenQueryErr, tokenSnap] = await to(
    admin
      .firestore()
      .doc(
        `${USERS_COLLECTION}/${uid}/${USER_API_KEYS_SUBCOLLECTION}/${apiKey}`
      )
      .get()
  )

  // Handle errors querying Firestore
  if (tokenQueryErr) {
    console.error(
      `Error querying Firestore for uid: "${uid}" apiKey: "${apiKey}"`,
      tokenQueryErr
    )
    return res.status(500).send('Internal error')
  }

  const tokenData = tokenSnap.data()

  if (!tokenData) {
    console.error(
      `Invalid token, responding with error for uid: "${uid}" apiKey: "${apiKey}"`
    )
    return res.status(401).send('Invalid API token')
  }

  // Generate custom token (expires in 1 hour)
  const [generateTokenErr, customToken] = await to(
    admin.auth().createCustomToken(uid, { isCustom: true })
  )

  // Handle errors generating custom token
  if (generateTokenErr) {
    console.error(
      `Error generating custom token for uid: "${uid}" token: "${apiKey}"`,
      generateTokenErr
    )
    return res.status(500).send('Internal error')
  }

  return res.send(customToken)
}

/**
 * @name generateAuthToken
 * Cloud Function triggered by HTTP request
 * @type {functions.CloudFunction}
 */
export default functions.https.onRequest(generateAuthTokenRequest)
