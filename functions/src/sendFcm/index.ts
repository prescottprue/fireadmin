import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { to } from '../utils/async'

const requestPath = 'sendFcm'

/**
 * @param {functions.firestore.DocumentSnapshot} snap - Snapshot of event
 * @param {functions.Context} context - Functions context
 * @returns {Promise} Resolves with results of sending FCM
 */
async function sendFcmEvent(
  snap: functions.database.DataSnapshot,
  context: functions.EventContext
): Promise<any> {
  const {
    params: { pushId }
  } = context
  const { userId, message = '', title = 'Fireadmin' } = snap.val() || {}

  console.log(`FCM request received for: ${userId}`)

  if (!userId) {
    const missingUserIdErr = 'userId is required to send FCM message'
    console.error(missingUserIdErr)
    throw new Error(missingUserIdErr)
  }

  const responseRef = admin.database().ref(`responses/${requestPath}/${pushId}`)

  // Get user profile
  const [getProfileErr, userProfileSnap] = await to(
    admin.firestore().doc(`users/${userId}`).get()
  )

  // Handle errors getting user profile
  if (getProfileErr) {
    console.error('Error getting user profile: ', getProfileErr)
    throw getProfileErr
  }

  // Get messaging token from user's profile
  const token = userProfileSnap?.get('messaging.mostRecentToken')

  // Exit with log if messaging token not found on user object
  if (!token) {
    console.debug(`Messaging token not found for uid "${userId}", exiting...`)
    return null
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
