import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { PROJECTS_COLLECTION } from '@fireadmin/core/lib/constants/firestorePaths'
import { to } from 'utils/async'
import { validateRequest } from 'utils/firebaseFunctions'

/**
 * @param req - Express HTTP Request
 * @param res - Express HTTP Response
 */
export async function generateAuthTokenRequest(req, res) {
  const requestData = req.body || {}
  console.log('Custom token request:', requestData)

  // Verify projectId exists
  const requiredParams = ['projectId', 'uid']
  validateRequest(requiredParams, requestData, res)

  const { projectId, token, uid } = requestData

  // Write token to tokens collection
  const [tokenQueryErr, tokenSnap] = await to(
    admin
      .firestore()
      .doc(`${PROJECTS_COLLECTION}/${projectId}/tokens/${token}`)
      .get()
  )

  // Handle errors querying Firestore
  if (tokenQueryErr) {
    console.error(
      `Error querying Firestore for project "${projectId}" uid: "${uid}" token: "${token}"`,
      tokenQueryErr
    )
    return res.status(500).send('Internal error')
  }

  const tokenData = tokenSnap.data()

  if (!tokenData || tokenData.createdBy !== uid) {
    console.error(
      `Invalid token, responding with error for "${projectId}" uid: "${uid}" token: "${token}"`
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
      `Error generating custom token for project: "${projectId}" uid: "${uid}" token: "${token}"`,
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
