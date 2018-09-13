import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { get } from 'lodash'
import { to } from 'utils/async'
import { getFirebaseConfig } from 'utils/firebaseFunctions'
import { waitForValue } from 'utils/rtdb'

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
  console.log('request recived for fcm:', pushId, userId)

  if (!userId) {
    const missingUserIdErr = 'userId is required to send FCM message'
    console.error(missingUserIdErr)
    throw new Error(missingUserIdErr)
  }

  const responseRef = admin.database().ref(`responses/${requestPath}/${pushId}`)
  // Get user profile
  const [getProfileErr, userProfileSnap] = await to(
    admin
      .firestore()
      .collection('users')
      .doc(userId)
      .get()
  )

  // Handle errors getting user profile
  if (getProfileErr) {
    console.error('Error getting user profile: ', getProfileErr)
    throw getProfileErr
  }

  const messagingToken = get(
    userProfileSnap.data(),
    'messaging.mostRecentToken'
  )

  // Handle messaging token not being found on user object
  if (!messagingToken) {
    const missingTokenMsg = `Messaging token not found for uid: "${userId}"`
    console.error(missingTokenMsg)
    throw new Error(missingTokenMsg)
  }

  const projectId = getFirebaseConfig('projectId')

  const callGoogleApiRequestRef = admin
    .database()
    .ref(`requests/callGoogleApi`)
    .push()
  const callGoogleApiResponseRef = admin
    .database()
    .ref(`responses/callGoogleApi/${callGoogleApiRequestRef.key}`)

  // Call Google API with message send
  await callGoogleApiRequestRef.set({
    apiUrl: `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    method: 'POST',
    body: {
      message: {
        notification: {
          title,
          body: message
        },
        token: messagingToken
      }
    }
  })

  // Wait for response from callGoogleApi request to FCM API
  const [googleResponseErr, googleResponseSnap] = await to(
    waitForValue(callGoogleApiResponseRef)
  )

  // Handle errors getting response to sendFcm Request
  if (googleResponseErr) {
    console.error(
      `Error writing response: ${googleResponseErr.message || ''}`,
      googleResponseErr
    )

    // Write error to response
    const [writeErr] = await to(
      responseRef.set({
        complete: true,
        status: 'error',
        error: googleResponseErr.message || 'Error',
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

    throw googleResponseErr
  }

  // Set response to original sendFcm request
  const [writeErr, response] = await to(
    responseRef.set({
      complete: true,
      status: 'success',
      completedAt: admin.database.ServerValue.TIMESTAMP,
      googleApiResponse: get(googleResponseSnap.val(), 'responseData', null),
      callGoogleApiRequestKey: callGoogleApiRequestRef.key
    })
  )

  const userAlertsRef = admin.firestore().collection('user_alerts')
  // Write to user_alerts
  await userAlertsRef.add({
    userId,
    message,
    title,
    read: false
  })

  // Handle errors writing response to sendFcm Request
  if (writeErr) {
    console.error(
      `Error writing response to RTDB: ${writeErr.message || ''}`,
      writeErr
    )
    throw writeErr
  }

  return response
}

/**
 * @name sendFcm
 * Cloud Function triggered by Real Time Database Create Event
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref(`/requests/${requestPath}/{pushId}`)
  .onCreate(sendFcmEvent)
