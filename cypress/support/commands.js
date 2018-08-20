import path from 'path'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'

const projectId = Cypress.env('FIREBASE_PROJECT_ID')

const fbConfig = {
  apiKey: Cypress.env('FIREBASE_API_KEY'),
  authDomain: `${projectId}.firebaseapp.com`,
  databaseURL: `https://${projectId}.firebaseio.com`,
  projectId: `${projectId}`,
  storageBucket: `${projectId}.appspot.com`
}

window.fbInstance = firebase.initializeApp(fbConfig)

Cypress.Commands.add('login', (email, password) => {
  if (!Cypress.env('FIREBASE_AUTH_JWT')) {
    cy.log(
      'FIREBASE_AUTH_JWT must be set to cypress environment in order to login'
    )
    return
  }
  if (firebase.auth().currentUser) {
    cy.log('Current user already exists, login complete.')
  } else {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(auth => {
        if (auth) {
          resolve(auth)
        }
      })
      firebase
        .auth()
        .signInWithCustomToken(Cypress.env('FIREBASE_AUTH_JWT'))
        .then(() => {
          console.debug('Login command successful')
        })
        .catch(reject)
    })
  }
})

Cypress.Commands.add('logout', (email, password) => {
  cy.log('Confirming use is logged out...')
  if (!firebase.auth().currentUser) {
    cy.log('Current user already logged out.')
  } else {
    cy.log('Current user exists, logging out...')
    firebase.auth().signOut()
  }
})

function getArgsString(args) {
  return args && args.length ? ` ${args.join(' ')}` : ''
}

/**
 * Call Firestore instance with some specified action. Authentication is through serviceAccount.json since it is at the base
 * level. If using delete, auth is through FIREBASE_TOKEN since firebase-tools is used (instead of firebaseExtra).
 * @param {String} action - The action type to call with (set, push, update, remove)
 * @param {String} actionPath - Path within RTDB that action should be applied
 * @param {Object} opts - Options
 * @param {Array} opts.args - Command line args to be passed
 * @type {Cypress.Command}
 * @type {[type]}
 */
Cypress.Commands.add('callFirestore', (action, actionPath, opts = {}) => {
  const { args = [] } = opts
  // callFirestore('delete', 'project/test-project', { args: '-r' })
  // callFirestore('delete', 'project/test-project', { recursive: true })
  // callFirestore('add', 'project/test-project', 'fakeProject.json')
  const baseArgsString = getArgsString(args)
  switch (action) {
    case 'delete':
      const argsString = `${baseArgsString}${opts.recursive ? ' -r' : ''}`
      return cy.exec(
        `npx firebase firestore ${action} ${actionPath}${argsString}`
      )
    default:
      const argsWithMeta = `${baseArgsString}${opts.withMeta ? ' -m' : ''}`
      cy.exec(
        `cypress/utils/firebaseExtra firestore ${action} ${actionPath}${argsWithMeta}`
      )
  }
})

/**
 * Call Real Time Database path with some specified action. Authentication is through FIREBASE_TOKEN since firebase-tools
 * @param {String} action - The action type to call with (set, push, update, remove)
 * @param {String} actionPath - Path within RTDB that action should be applied
 * @param {Object} opts - Options
 * @param {Array} opts.args - Command line args to be passed
 * @type {Cypress.Command}
 */
Cypress.Commands.add('callRtdb', (action, actionPath, opts) => {
  const { args = [] } = opts
  // callRtdb('add', 'projects/test-project', { some: data })
  // callRtdb('add', 'projects/test-project', 'somepath.json')
  // TODO: Support loading fixtures into command
  const baseArgsString = getArgsString(args)
  switch (action) {
    default:
      return cy.exec(
        `npx firebase database:${action}${baseArgsString} ${actionPath}`
      )
  }
})

/**
 * Converts fixture to Blob. All file types are converted to base64 then
 * converted to a Blob using Cypress expect application/json. Json files are
 * just stringified then converted to a blob (fixes issue invalid Blob issues).
 * @param {String} fileUrl - The file url to upload
 * @param {String} type - content type of the uploaded file
 * @return {Promise} Resolves with blob containing fixture contents
 */
function getFixtureBlob(fileUrl, type) {
  return type === 'application/json' || path.extname(fileUrl) === 'json'
    ? cy
        .fixture(fileUrl)
        .then(JSON.stringify)
        .then(json => new Blob([json], { type: 'application/json' }))
    : cy.fixture(fileUrl, 'base64').then(Cypress.Blob.base64StringToBlob)
}

/**
 * Uploads a file to an input
 * @memberOf Cypress.Chainable#
 * @name uploadFile
 * @function
 * @param {String} selector - element to target
 * @param {String} fileUrl - The file url to upload
 * @param {String} type - content type of the uploaded file
 */
Cypress.Commands.add('uploadFile', (selector, fileUrl, type = '') => {
  return cy.get(selector).then(subject => {
    return getFixtureBlob(fileUrl, type).then(blob => {
      return cy.window().then(win => {
        const name = fileUrl.split('/').pop()
        const testFile = new win.File([blob], name, { type: blob.type })
        const dataTransfer = new win.DataTransfer()
        dataTransfer.items.add(testFile)
        const el = subject[0]
        el.files = dataTransfer.files
        return subject
      })
    })
  })
})

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
