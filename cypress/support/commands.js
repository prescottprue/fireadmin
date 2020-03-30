import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'
import { attachCustomCommands } from 'cypress-firebase'
import { getFixtureBlob } from '../utils/commands'
import fakeEnvironment from '../fixtures/fakeEnvironment.json'
import fakeEvent from '../fixtures/fakeEvent.json'

const fbConfig = {
  apiKey: 'AIzaSyCmw3fvlPnZtqChbIY_yEWXUcDGlemeIRQ',
  authDomain: 'fireadmin-stage.firebaseapp.com',
  databaseURL: Cypress.env('FIREBASE_DATABASE_EMULATOR_HOST')
    ? `http://${Cypress.env(
        'FIREBASE_DATABASE_EMULATOR_HOST'
      )}?ns=fireadmin-stage`
    : `https://fireadmin-stage.firebaseio.com`,
  projectId: 'fireadmin-stage',
  storageBucket: `fireadmin-stage.appspot.com`
}

firebase.initializeApp(fbConfig)

// Use Firestore emulator
if (Cypress.env('FIRESTORE_EMULATOR_HOST')) {
  const firestoreSettings = {
    host: Cypress.env('FIRESTORE_EMULATOR_HOST'),
    ssl: false
  }
    console.log('Using Firestore emulator', firestoreSettings.host) // eslint-disable-line

  if (window.Cypress) {
    // Needed for Firestore support in Cypress (see https://github.com/cypress-io/cypress/issues/6350)
    firestoreSettings.experimentalForceLongPolling = true
  }

  firebase.firestore().settings(firestoreSettings)
}

// Custom commands including login, signup, callRtdb, and callFirestore
attachCustomCommands({ Cypress, cy, firebase })

/**
 * Uploads a file to an input
 * @memberOf Cypress.Chainable#
 * @name uploadFile
 * @function
 * @param {String} selector - element to target
 * @param {String} fileUrl - The file url to upload
 * @param {String} type - content type of the uploaded file
 */
Cypress.Commands.add(
  'uploadFile',
  (selectorValue, fileUrl, type = 'application/json') => {
    return cy.get(selectorValue, { force: true }).then((subject) => {
      return getFixtureBlob(fileUrl, type).then((blob) => {
        return cy.window().then((win) => {
          const el = subject[0]
          const nameSegments = fileUrl.split('/')
          const name = nameSegments[nameSegments.length - 1]
          const testFile = new win.File([blob], name, { type })
          const dataTransfer = new win.DataTransfer()
          dataTransfer.items.add(testFile)
          el.files = dataTransfer.files
          cy.wrap(subject).trigger('drop', {
            dataTransfer: { files: [testFile] },
            force: true
          })
        })
      })
    })
  }
)

/**
 * @memberOf Cypress.Chainable#
 * @name addProjectEnvironment
 * @function
 */
Cypress.Commands.add(
  'addProjectEnvironment',
  (project, environment, extraData = {}) => {
    cy.callFirestore(
      'set',
      `projects/${project}/environments/${environment}`,
      { ...fakeEnvironment, ...extraData },
      {
        withMeta: true
      }
    )
  }
)

/**
 * @memberOf Cypress.Chainable#
 * @name addProjectEvent
 * @function
 */
Cypress.Commands.add('addProjectEvent', (project, eventId, extraData = {}) => {
  cy.callFirestore(
    'set',
    `projects/${project}/events/${eventId}`,
    {
      ...fakeEvent,
      ...extraData
    },
    { withMeta: true }
  )
})
