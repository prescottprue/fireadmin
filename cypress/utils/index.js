import firebase from 'firebase'

function initializeFirebase() {
  const firebaseConfig = {
    apiKey: Cypress.env('FIREBASE_API_KEY'),
    authDomain: `${Cypress.env('FIREBASE_PROJECT_ID')}.firebaseapp.com`,
    databaseURL: `https://${Cypress.env('FIREBASE_PROJECT_ID')}.firebaseio.com`,
    projectId: `${Cypress.env('FIREBASE_PROJECT_ID')}`,
    storageBucket: `${Cypress.env('FIREBASE_PROJECT_ID')}.appspot.com`
  }
  try {
    firebase.initializeApp(firebaseConfig)
  } catch (err) {}
}

export function getAuthToken() {
  initializeFirebase()
  const db = firebase.database()
  const requestsRef = db.ref('requests/createAuthToken')
  const responsesRef = db.ref('responses/createAuthToken')
  firebase.auth().onAuthStateChanged(user => {
    requestsRef
      .push({
        uid: Cypress.env('TEST_UID'),
        currentUid: user.uid,
        password: Cypress.env('TEST_PASSWORD')
      })
      .then(pushSnap => {
        console.log('push snap:', pushSnap.key, pushSnap.ref)
        return new Promise((resolve, reject) => {
          responsesRef.child(pushSnap.ref.key).on(
            'value',
            responseSnap => {
              const responseVal = responseSnap.val()
              if (responseVal && responseVal.token) {
                resolve(responseVal.token)
              }
            },
            reject
          )
        })
      })
  })
  return firebase
    .auth()
    .signInAnonymously()
    .catch(error => {
      console.log('Error logging in:', error)
      return Promise.reject(error)
    })
}
