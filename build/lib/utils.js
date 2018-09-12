const admin = require('firebase-admin') // eslint-disable-line import/no-extraneous-dependencies
const isString = require('lodash/isString')
const fs = require('fs')
const path = require('path')
const config = require('../../project.config')

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

  // Config file used for environment (local, containers)
  if (!process.env.CI && !process.env.CI_ENVIRONMENT_SLUG) {
    const localTestConfigPath = path.join(
      config.basePath,
      config.e2eTestDir,
      'config.json'
    )
    const configObj = require(localTestConfigPath) // eslint-disable-line global-require, import/no-dynamic-require
    return configObj[combined] || configObj[varNameRoot]
  }

  // CI Environment (environment variables loaded directly)
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
    /* eslint-disable no-console */
    console.error(
      `${combinedVar} not found, make sure it is set within environment vars`
    )
    /* eslint-enable no-console */
  }
  try {
    if (isString(val)) {
      return JSON.parse(val)
    }
    return val
  } catch (err) {
    /* eslint-disable no-console */
    console.error(`Error parsing ${combinedVar}`)
    /* eslint-enable no-console */
    return val
  }
}

/**
 * Get service account from either local file or environment variables
 * @return {Object} Service account object
 */
function getServiceAccount() {
  const serviceAccountPath = path.join(config.basePath, 'serviceAccount.json')
  // Check for local service account file (Local dev)
  if (fs.existsSync(serviceAccountPath)) {
    return require(serviceAccountPath) // eslint-disable-line global-require, import/no-dynamic-require
  }
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
    if (!adminInstance) {
      const serviceAccount = getServiceAccount()
      adminInstance = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
      })
      adminInstance.firestore().settings({ timestampsInSnapshots: true })
    }
    return adminInstance
  } catch (err) {
    /* eslint-disable no-console */
    console.log(
      'Error initializing firebase-admin instance from service account.'
    )
    /* eslint-enable no-console */
    throw err
  }
}

/**
 * Create data object with values for each document with keys being doc.id.
 * @param  {firebase.database.DataSnapshot} snapshot - Data for which to create
 * an ordered array.
 * @return {Object|Null} Object documents from snapshot or null
 */
function dataArrayFromSnap(snap) {
  const data = []
  if (snap.data && snap.exists) {
    data.push({ id: snap.id, data: snap.data() })
  } else if (snap.forEach) {
    snap.forEach(doc => {
      data.push({ id: doc.id, data: doc.data() || doc })
    })
  }
  return data
}
/**
 * Convert slash path to Firestore reference and handle other query options
 * such as limit
 * @param  {firestore.Firestore} firestoreInstance - Instance on which to
 * create ref
 * @param  {String} slashPath - Path to convert into firestore refernce
 * @return {firestore.CollectionReference|firestore.DocumentReference}
 */
function slashPathToFirestoreRef(firestoreInstance, slashPath, options = {}) {
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

  // Apply limit to query if it exists
  if (options.limit && typeof ref.limit === 'function') {
    ref = ref.limit(options.limit)
  }

  return ref
}

module.exports = {
  initializeFirebase,
  dataArrayFromSnap,
  slashPathToFirestoreRef,
  envVarBasedOnCIEnv,
  getParsedEnvVar,
  getServiceAccount
}
