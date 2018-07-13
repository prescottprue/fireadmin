import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { get } from 'lodash'
import path from 'path'

/**
 * @param  {functions.Event} event - Function event
 * @param {functions.Context} context - Functions context
 * @return {Promise}
 */
async function createAuthTokenEvent(snap, context) {
  const serviceAccount = require(path.join(
    process.cwd(),
    'serviceAccount.json'
  ))
  if (!serviceAccount) {
    const errMsg = 'Service Account required'
    console.error(errMsg)
    throw new Error(errMsg)
  }
  const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG)
  adminConfig.credential = admin.credential.cert(serviceAccount)
  const appFromSA = admin.initializeApp(adminConfig, 'withServiceAccount')
  const {
    params: { pushId },
    auth
  } = context
  const { uid: uidParam } = snap.val()
  const uid = get(auth, 'uid', uidParam)
  try {
    const customToken = await appFromSA
      .auth()
      .createCustomToken(uid, { isTesting: true })
    const responseData = {
      completed: true,
      token: customToken,
      completedAt: admin.database.ServerValue.TIMESTAMP
    }
    await appFromSA
      .database()
      .ref(`responses/createAuthToken/${pushId}`)
      .update(responseData)
    appFromSA.delete()
    return null
  } catch (err) {
    console.error(
      `Error generating custom token for uid: ${uid}`,
      err.message || err
    )
    return err
  }
}

/**
 * @name createAuthToken
 * Cloud Function triggered by Real Time Database Create Event
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref('/requests/createAuthToken/{pushId}')
  .onCreate(createAuthTokenEvent)
