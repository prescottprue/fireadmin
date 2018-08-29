/* eslint-disable no-console */
import firebase from 'firebase/app'
import { publicVapidKey } from '../config'
import 'firebase/messaging'

export function requestPermission() {
  console.log('Requesting permission...')
  return firebase
    .messaging()
    .requestPermission()
    .then(() => {
      console.log('Notification permission granted.')
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      // In many cases once an app has been granted notification permission, it
      // should update its UI reflecting this.
      // resetUI()
    })
    .catch(err => {
      console.log('Unable to get permission to notify.', err)
      return Promise.reject(err)
    })
}

export function initializeMessaging() {
  const messaging = firebase.messaging()
  // Add the public key generated from the console here.
  messaging.usePublicVapidKey(publicVapidKey)

  messaging
    .getToken()
    .then(refreshedToken => {
      console.log('Original token get.', refreshedToken)
      // Indicate that the new Instance ID token has not yet been sent to the
      // app server.
      // setTokenSentToServer(false)
      // Send Instance ID token to app server.
      // sendTokenToServer(refreshedToken)
      // Display new Instance ID token and clear UI of all previous messages.
      // resetUI()
    })
    .catch(err => {
      console.log('Unable to retrieve refreshed token ', err)
      return Promise.reject(err)
    })

  // Callback fired if Instance ID token is updated.
  messaging.onTokenRefresh(() => {
    messaging
      .getToken()
      .then(refreshedToken => {
        console.log('Token refreshed.', refreshedToken)
        // Indicate that the new Instance ID token has not yet been sent to the
        // app server.
        // setTokenSentToServer(false)
        // Send Instance ID token to app server.
        // sendTokenToServer(refreshedToken)
        // Display new Instance ID token and clear UI of all previous messages.
        // resetUI()
      })
      .catch(err => {
        console.log('Unable to retrieve refreshed token ', err)
        return Promise.reject(err)
      })
  })

  // Handle incoming messages. Called when:
  // - a message is received while the app has focus
  // - the user clicks on an app notification created by a service worker
  //   `messaging.setBackgroundMessageHandler` handler.
  messaging.onMessage(payload => {
    console.log('Message received. ', payload)
    // Update the UI to include the received message.
    // appendMessage(payload)
  })

  requestPermission()
}
