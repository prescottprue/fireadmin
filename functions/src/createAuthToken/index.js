import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { get } from 'lodash'

/**
 * @param  {functions.Event} event - Function event
 * @param {functions.Context} context - Functions context
 * @return {Promise}
 */
async function createAuthTokenEvent(snap, context) {
  const { uid: qaUid, password: qaPassword } = get(functions.config(), 'qa', {})
  const {
    params: { pushId },
    auth
  } = context
  const { uid: uidParam, password } = snap.val()
  // Confirm that uid and password are within request
  if (!uidParam || !password) {
    throw new Error('UID and password parameters are required')
  }
  // Only allow qa UID and password combo
  if (password !== qaPassword || uidParam !== qaUid) {
    throw new Error('Invalid password and uid combo')
  }
  const uid = get(auth, 'uid', uidParam)
  const serviceAccount = functions.config().service_account
  if (!serviceAccount) {
    const errMsg = 'Service Account required'
    console.error(errMsg)
    throw new Error(errMsg)
  }
  const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG)
  adminConfig.credential = admin.credential.cert(serviceAccount)
  const appFromSA = admin.initializeApp(adminConfig, 'withServiceAccount')
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
 * Cloud Function to create custom auth tokens for use in testing
 * triggered by Real Time Database Create Event
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref('/requests/createAuthToken/{pushId}')
  .onCreate(createAuthTokenEvent)
