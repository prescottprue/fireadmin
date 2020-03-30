import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { get } from 'lodash'
import { to } from 'utils/async'

const requestPath = 'sendFcm'

/**
 * @param  {functions.Event} event - Function event
 * @param {functions.Context} context - Functions context
 * @return {Promise}
 */
async function sendFcmEvent(snap, context) {
  const {
    params: { pushId }
  } = context
  const { userId, message = '', title = 'Fireadmin' } = snap.val() || {}

  console.log(`FCM request recived for: ${userId}`)

  if (!userId) {
    const missingUserIdErr = 'userId is required to send FCM message'
    console.error(missingUserIdErr)
    throw new Error(missingUserIdErr)
  }

  const responseRef = admin.database().ref(`responses/${requestPath}/${pushId}`)

  // Get user profile
  const [getProfileErr, userProfileSnap] = await to(
    admin.firestore().collection('users').doc(userId).get()
  )

  // Handle errors getting user profile
  if (getProfileErr) {
    console.error('Error getting user profile: ', getProfileErr)
    throw getProfileErr
  }

  // Get messaging token from user's profile
  const token = get(userProfileSnap.data(), 'messaging.mostRecentToken')

  // Handle messaging token not being found on user object
  if (!token) {
    const missingTokenMsg = `Messaging token not found for uid: "${userId}"`
    console.error(missingTokenMsg)
    throw new Error(missingTokenMsg)
  }

  // Send FCM message to client
  const [sendMessageErr] = await to(
    admin.messaging().send({
      token,
      notification: {
        title,
        body: message
      }
    })
  )

  // Handle errors sending FCM message
  if (sendMessageErr) {
    console.error(
      `Error writing response: ${sendMessageErr.message || ''}`,
      sendMessageErr
    )

    // Write error to response
    const [writeErr] = await to(
      responseRef.set({
        complete: true,
        status: 'error',
        error: sendMessageErr.message || 'Error',
        completedAt: admin.database.ServerValue.TIMESTAMP
      })
    )

    // Log errors writing error to RTDB
    if (writeErr) {
      console.error(
        `Error writing error to RTDB: ${writeErr.message || ''}`,
        writeErr
      )
    }

    throw sendMessageErr
  }

  // Set response to original sendFcm request
  const [writeErr] = await to(
    responseRef.set({
      complete: true,
      status: 'success',
      completedAt: admin.database.ServerValue.TIMESTAMP
    })
  )

  const userAlertsRef = admin.firestore().collection('user_alerts')

  // Write to user_alerts collection
  await userAlertsRef.add({
    userId,
    message,
    title,
    read: false
  })

  // Handle errors writing response of sendFcm to RTDB
  if (writeErr) {
    console.error(
      `Error writing response to RTDB: ${writeErr.message || ''}`,
      writeErr
    )
    throw writeErr
  }

  return null
}

/**
 * @name sendFcm
 * Cloud Function triggered by Real Time Database Create Event
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref(`/requests/${requestPath}/{pushId}`)
  .onCreate(sendFcmEvent)
