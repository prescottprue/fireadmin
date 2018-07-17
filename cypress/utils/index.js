import firebase from 'firebase'

let currentToken

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
  if (currentToken) {
    return Promise.resolve(currentToken)
  }
  initializeFirebase()
  const db = firebase.database()
  const requestsRef = db.ref('requests/createAuthToken')
  const responsesRef = db.ref('responses/createAuthToken')
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      requestsRef
        .push({
          uid: Cypress.env('TEST_UID'),
          currentUid: user.uid,
          password: Cypress.env('TEST_PASSWORD')
        })
        .then(pushSnap => {
          return new Promise((resolve, reject) => {
            const off = responsesRef.child(pushSnap.ref.key).on(
              'value',
              responseSnap => {
                const responseVal = responseSnap.val()
                if (responseVal && responseVal.token) {
                  currentToken = responseVal.token
                  off()
                  resolve(responseVal.token)
                }
              },
              reject
            )
          })
        })
    }
  })
  return firebase
    .auth()
    .signInAnonymously()
    .catch(error => {
      console.log('Error logging in:', error)
      return Promise.reject(error)
    })
}

export function createSelector(selectorValue) {
  return `[data-test=${selectorValue}]`
}
