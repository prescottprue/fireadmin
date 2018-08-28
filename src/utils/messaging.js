/* eslint-disable no-console */
import firebase from 'firebase/app'
import { publicVapidKey } from '../config'
import 'firebase/messaging'

export function requestPermission() {
  console.log('Requesting permission...')
  // [START request_permission]
  firebase
    .messaging()
    .requestPermission()
    .then(function() {
      console.log('Notification permission granted.')
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      // [START_EXCLUDE]
      // In many cases once an app has been granted notification permission, it
      // should update its UI reflecting this.
      // resetUI()
      // [END_EXCLUDE]
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err)
    })
  // [END request_permission]
}

export function initializeMessaging() {
  const messaging = firebase.messaging()
  // Add the public key generated from the console here.
  messaging.usePublicVapidKey(publicVapidKey)

  // Callback fired if Instance ID token is updated.
  messaging.onTokenRefresh(function() {
    messaging
      .getToken()
      .then(function(refreshedToken) {
        console.log('Token refreshed.')
        // Indicate that the new Instance ID token has not yet been sent to the
        // app server.
        // setTokenSentToServer(false)
        // Send Instance ID token to app server.
        // sendTokenToServer(refreshedToken)
        // [START_EXCLUDE]
        // Display new Instance ID token and clear UI of all previous messages.
        // resetUI()
        // [END_EXCLUDE]
      })
      .catch(function(err) {
        console.log('Unable to retrieve refreshed token ', err)
        // showToken('Unable to retrieve refreshed token ', err)
      })
  })
  // [END refresh_token]
  // [START receive_message]
  // Handle incoming messages. Called when:
  // - a message is received while the app has focus
  // - the user clicks on an app notification created by a service worker
  //   `messaging.setBackgroundMessageHandler` handler.
  messaging.onMessage(function(payload) {
    console.log('Message received. ', payload)
    // [START_EXCLUDE]
    // Update the UI to include the received message.
    // appendMessage(payload)
    // [END_EXCLUDE]
  })
  requestPermission()
}
