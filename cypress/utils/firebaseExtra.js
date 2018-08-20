#!/usr/bin/env node
/* eslint-disable no-console */
const admin = require('firebase-admin')
const isString = require('lodash/isString')
const fs = require('fs')
const path = require('path')
const localTestConfigPath = path.join(
  __dirname,
  '../..',
  'cypress',
  'config.json'
)
const serviceAccountPath = path.join(__dirname, '../..', 'serviceAccount.json')
const prefixesByCiEnv = {
  staging: 'STAGE_',
  production: 'PROD_'
}

/**
 * Get prefix for current environment based on environment vars available
 * within CI. Falls back to staging (i.e. STAGE)
 * @return {String} Environment prefix string
 */
function getEnvPrefix() {
  return (
    prefixesByCiEnv[process.env.CI_ENVIRONMENT_SLUG] || prefixesByCiEnv.staging
  )
}

/**
 * Convert slash path to Firestore reference
 * @param  {firestore.Firestore} firestoreInstance - Instance on which to
 * create ref
 * @param  {String} slashPath - Path to convert into firestore refernce
 * @return {firestore.CollectionReference|firestore.DocumentReference}
 */
function slashPathToFirestoreRef(firestoreInstance, slashPath) {
  let ref = firestoreInstance
  const srcPathArr = slashPath.split('/')
  srcPathArr.forEach(pathSegment => {
    if (ref.collection) {
      ref = ref.collection(pathSegment)
    } else if (ref.doc) {
      ref = ref.doc(pathSegment)
    } else {
      throw new Error(`Invalid slash path: ${slashPath}`)
    }
  })
  return ref
}

/**
 * Get environment variable based on the current CI environment
 * @param  {String} varNameRoot - variable name without the environment prefix
 * @return {Any} Value of the environment variable
 * @example
 * envVarBasedOnCIEnv('FIREBASE_PROJECT_ID')
 * // => 'fireadmin-stage' (value of 'STAGE_FIREBASE_PROJECT_ID' environment var)
 */
function envVarBasedOnCIEnv(varNameRoot) {
  const prefix = getEnvPrefix()
  const combined = `${prefix}${varNameRoot}`
  if (!process.env.CI && !process.env.CI_ENVIRONMENT_SLUG) {
    const configObj = require(localTestConfigPath)
    console.log(
      `Running in local environment, ${
        configObj[combined] ? combined : varNameRoot
      } is being loaded from cypress/config.json`
    )
    return configObj[combined] || configObj[varNameRoot]
  }
  return process.env[combined] || process.env[varNameRoot]
}

/**
 * Get parsed value of environment variable. Useful for environment variables
 * which have characters that need to be escaped.
 * @param  {String} varNameRoot - variable name without the environment prefix
 * @return {Any} Value of the environment variable
 * @example
 * getParsedEnvVar('FIREBASE_PRIVATE_KEY_ID')
 * // => 'fireadmin-stage' (parsed value of 'STAGE_FIREBASE_PRIVATE_KEY_ID' environment var)
 */
function getParsedEnvVar(varNameRoot) {
  const val = envVarBasedOnCIEnv(varNameRoot)
  const prefix = getEnvPrefix()
  const combinedVar = `${prefix}${varNameRoot}`
  if (!val) {
    console.error(
      `${combinedVar} not found, make sure it is set within environment vars`
    )
  }
  try {
    if (isString(val)) {
      return JSON.parse(val)
    }
    return val
  } catch (err) {
    console.error(`Error parsing ${combinedVar}`)
    return val
  }
}

/**
 * Get service account from either local file or environment variables
 * @return {Object} Service account object
 */
function getServiceAccount() {
  // Check for local service account file (Local dev)
  if (fs.existsSync(serviceAccountPath)) {
    console.log('local service account being loaded from ./serviceAccount.json')
    return require(serviceAccountPath)
  }
  console.log(
    'Service Account file does not exist locally, falling back to environment variables'
  )
  // Use environment variables (CI)
  return {
    type: 'service_account',
    project_id: envVarBasedOnCIEnv('FIREBASE_PROJECT_ID'),
    private_key_id: envVarBasedOnCIEnv('FIREBASE_PRIVATE_KEY_ID'),
    private_key: getParsedEnvVar('FIREBASE_PRIVATE_KEY'),
    client_email: envVarBasedOnCIEnv('FIREBASE_CLIENT_EMAIL'),
    client_id: envVarBasedOnCIEnv('FIREBASE_CLIENT_ID'),
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://accounts.google.com/o/oauth2/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: envVarBasedOnCIEnv('FIREBASE_CERT_URL')
  }
}

let adminInstance

/**
 * Initialize Firebase instance from service account (from either local
 * serviceAccount.json or environment variables)
 * @return {Firebase} Initialized Firebase instance
 */
function initializeFirebase() {
  try {
    // Get service account from local file falling back to environment variables
    const serviceAccount = getServiceAccount()

    if (!adminInstance) {
      if (!fs.existsSync(serviceAccountPath)) {
        const missingAccountErr = `Service account not found, check: ${serviceAccountPath}`
        console.error(missingAccountErr)
        throw new Error(missingAccountErr)
      }
      console.log(
        'service account exists, project id: ',
        serviceAccount.project_id
      )
      adminInstance = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
      })
      adminInstance.firestore().settings({ timestampsInSnapshots: true })
    }
    return adminInstance
  } catch (err) {
    console.log(
      'Error initializing firebase-admin instance from service account.'
    )
    throw err
  }
}

/**
 * @param  {functions.Event} event - Function event
 * @param {functions.Context} context - Functions context
 * @return {Promise}
 */
async function firestoreAction({
  action = 'set',
  actionPath,
  fixturePath,
  withMeta
}) {
  const fbInstance = initializeFirebase()
  const ref = slashPathToFirestoreRef(fbInstance.firestore(), actionPath)

  // Confirm ref has action as a method
  if (typeof ref[action] !== 'function') {
    const missingActionErr = `Ref at provided path "${actionPath}" does not have action "${action}"`
    console.log(missingActionErr)
    throw new Error(missingActionErr)
  }

  // Confirm fixture exists
  const pathToFixtureFile = path.join(__dirname, '..', 'fixtures', fixturePath)
  if (!cy.existsSync(pathToFixtureFile)) {
    throw new Error(`Fixture not found at path: ${fixturePath}`)
  }

  const fixtureData = cy.fixture(pathToFixtureFile)

  // Add meta if withMeta option exists
  if (withMeta) {
    if (action === 'update') {
      fixtureData.updatedBy = envVarBasedOnCIEnv('TEST_UID')
      fixtureData.updatedAt = fbInstance.firestore.FieldValue.serverTimestamp()
    } else {
      fixtureData.createdBy = envVarBasedOnCIEnv('TEST_UID')
      fixtureData.createdAt = fbInstance.firestore.FieldValue.serverTimestamp()
    }
  }

  try {
    // Call action with fixture data
    await ref[action](fixtureData)
    console.log(
      `action "${action}" at path "${actionPath}" successful with fixture: "${fixturePath}"`
    )
  } catch (err) {
    console.log(`Error with ${action} at path "${actionPath}": `, err)
    throw err
  }
}

const commands = [
  {
    command: 'firestore [action] [actionPath] [fixturePath]',
    describe: 'run action on Firebase using service account',
    builder: yargsInstance => {
      yargsInstance.positional('action', {
        describe: 'action to run on Firestore',
        default: 'set'
      })
      yargsInstance.positional('actionPath', {
        describe: 'path of action to run on Firestore',
        default: 'projects/test-project'
      })
      yargsInstance.positional('fixturePath', {
        describe: 'path of fixture to use ',
        default: 'fakeProject.json'
      })
    },
    handler: argv => {
      if (argv.verbose)
        console.info(
          `firestore command on :${argv.action} at ${argv.actionPath}`
        )
      return firestoreAction(argv)
    }
  }
]
;(async function() {
  const yargs = require('yargs')
  try {
    // TODO: Replace with commandDir when moving config to a directory
    for (let command in commands) {
      yargs.command(command)
    }
    yargs.option('withMeta', {
      alias: 'm',
      default: false
    })
    /* eslint-disable chai-friendly/no-unused-expressions */
    yargs.option('verbose', {
      alias: 'v',
      default: false
    }).argv
    /* eslint-enable chai-friendly/no-unused-expressions */
  } catch (err) {
    /* eslint-disable no-console */
    console.error(`Error running firebase action: ${err.message || 'Error'}`)
    /* eslint-enable no-console */
    process.exit(1)
  }
})()
