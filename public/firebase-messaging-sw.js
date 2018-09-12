/* eslint-disable no-console */
/* global firebase importScripts */
// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('https://www.gstatic.com/firebasejs/5.4.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/5.4.1/firebase-messaging.js')

const STAGE_MESSAGING_ID = '566109548798'
const PROD_MESSAGING_ID = '286913465508'

firebase.initializeApp({
  messagingSenderId:
    self.location.hostname.includes('fireadmin-33d82') ||
    self.location.hostname === 'fireadmin.io'
      ? PROD_MESSAGING_ID
      : STAGE_MESSAGING_ID
})

const messaging = firebase.messaging()

// Custom background message handler
messaging.setBackgroundMessageHandler(function(payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  )

  const notificationTitle = 'Fireadmin'
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  }

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  )
})
