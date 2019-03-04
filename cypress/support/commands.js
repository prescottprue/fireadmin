import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'
import { attachCustomCommands } from 'cypress-firebase'
import { getFixtureBlob } from '../utils/commands'
import fakeEnvironment from '../fixtures/fakeEnvironment.json'
import fakeEvent from '../fixtures/fakeEvent.json'

const projectId = Cypress.env('FIREBASE_PROJECT_ID')
const env = Cypress.env('env') || 'stage'
const apiKey =
  Cypress.env(`${env.toUpperCase()}_FIREBASE_API_KEY`) ||
  Cypress.env('FIREBASE_API_KEY')

const fbConfig = {
  apiKey,
  authDomain: `${projectId}.firebaseapp.com`,
  databaseURL: `https://${projectId}.firebaseio.com`,
  projectId: `${projectId}`,
  storageBucket: `${projectId}.appspot.com`
}

window.fbInstance = firebase.initializeApp(fbConfig)

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
    return cy.get(selectorValue).then(subject => {
      return getFixtureBlob(fileUrl, type).then(blob => {
        return cy.window().then(win => {
          const el = subject[0]
          const nameSegments = fileUrl.split('/')
          const name = nameSegments[nameSegments.length - 1]
          const testFile = new win.File([blob], name, { type })
          const dataTransfer = new win.DataTransfer()
          dataTransfer.items.add(testFile)
          el.files = dataTransfer.files
          return subject
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
