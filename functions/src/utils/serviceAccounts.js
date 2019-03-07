/* eslint-disable no-console */
import * as admin from 'firebase-admin'
import os from 'os'
import fs from 'fs-extra'
import request from 'request-promise'
import path from 'path'
import rimraf from 'rimraf'
import google from 'googleapis'
import { get, uniqueId } from 'lodash'
import mkdirp from 'mkdirp-promise'
import { decrypt } from './encryption'
import { to } from './async'
import { hasAll } from './index'

export const SCOPES = [
  'https://www.googleapis.com/auth/devstorage.full_control',
  'https://www.googleapis.com/auth/cloud-platform'
]

const serviceAccountParams = [
  'type',
  'project_id',
  'private_key_id',
  'private_key',
  'client_email',
  'client_id',
  'auth_uri',
  'token_uri'
]

/**
 * Get Google APIs auth client. Auth comes from serviceAccount.
 * @return {Promise} Resolves with JWT Auth Client (for attaching to request)
 */
async function authClientFromServiceAccount(serviceAccount) {
  if (!hasAll(serviceAccount, serviceAccountParams)) {
    throw new Error('Invalid service account')
  }
  const jwtClient = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    SCOPES
  )
  return new Promise((resolve, reject) => {
    jwtClient.authorize(err => {
      if (!err) {
        google.options({ auth: jwtClient })
        resolve(jwtClient)
      } else {
        console.error(
          'Error authorizing with Service Account',
          err.message || err
        )
        reject(err)
      }
    })
  })
}

const missingCredMsg =
  'Credential parameter is required to load service account from Firestore'

/**
 * Get Firebase app from request evvent containing path information for
 * service account
 * @param  {Object} opts - Options object
 * @param  {Object} eventData - Data from event request
 * @return {Promise} Resolves with Firebase app
 */
export async function getAppFromServiceAccount(opts, eventData) {
  const { databaseURL, storageBucket, environmentKey, id } = opts
  if (!databaseURL) {
    throw new Error(
      'databaseURL is required for action to authenticate through serviceAccount'
    )
  }
  if (!environmentKey && !id) {
    throw new Error(
      'environmentKey or id is required for action to authenticate through serviceAccount'
    )
  }
  console.log(`Getting service account from Firestore...`)
  const { projectId } = eventData

  // Make unique app name (prevents issue of multiple apps initialized with same name)
  const appName = `app-${uniqueId()}`
  // Get Service account data from resource (i.e Storage, Firestore, etc)
  const [err, accountFilePath] = await to(
    serviceAccountFromFirestorePath(
      `projects/${projectId}/environments/${id || environmentKey}`,
      appName,
      { returnData: false }
    )
  )

  if (err) {
    console.error(`Error getting service account: ${err.message || ''}`, err)
    throw err
  }

  try {
    const appCreds = {
      credential: admin.credential.cert(accountFilePath),
      databaseURL
    }
    if (storageBucket) {
      appCreds.storageBucket = storageBucket
    }
    return admin.initializeApp(appCreds, appName)
  } catch (err) {
    console.error('Error initializing firebase app:', err.message || err)
    throw err
  }
}

/**
 * Load service account data From Firestore
 * @param  {String} docPath - Path to Firestore document containing service
 * account
 * @param  {String} name - Name under which to store local service account file
 * @return {Promise}
 */
export async function serviceAccountFromFirestorePath(
  docPath,
  name,
  { returnData = false }
) {
  const firestore = admin.firestore()
  const projectDoc = await firestore.doc(docPath).get()

  // Handle project not existing in Firestore
  if (!projectDoc.exists) {
    const getProjErr = `Project containing service account not at path: ${docPath}`
    console.error(getProjErr)
    throw new Error(getProjErr)
  }

  // Get serviceAccount parameter from project
  const projectData = projectDoc.data()
  const { credential } = get(projectData, 'serviceAccount', {})

  // Handle credential parameter not existing on doc
  if (!credential) {
    console.error(missingCredMsg)
    throw new Error(missingCredMsg)
  }

  // Decrypt service account string
  let serviceAccountStr
  try {
    serviceAccountStr = decrypt(credential)
  } catch (err) {
    console.error('Error decrypting credential string', err)
    throw new Error('Error decrypting credential string')
  }

  // Parse Service Account string to an object
  let serviceAccountData
  try {
    serviceAccountData = JSON.parse(serviceAccountStr)
  } catch (err) {
    console.error('Service account not a valid object', err)
    throw new Error('Service account not a valid object')
  }

  const localPath = `serviceAccounts/${name}.json`
  const tempLocalPath = path.join(os.tmpdir(), localPath)
  const tempLocalDir = path.dirname(tempLocalPath)

  // Return service account data if specified by options
  if (returnData) {
    return serviceAccountData
  }

  // Write decrypted string as a local file and return
  try {
    // Create local folder for decrypted serice account file
    await mkdirp(tempLocalDir)
    // Write decrypted string as a local file
    await fs.writeJson(tempLocalPath, serviceAccountData)
    // Return localPath of service account
    return tempLocalPath
  } catch (err) {
    console.error(
      `Error writing service account from Firestore to local file ${err.message ||
        ''}`,
      err
    )
    throw err
  }
}

/**
 * Request google APIs with auth attached
 * @param  {Object}  opts - Google APIs method to call
 * @param  {String}  opts.projectId - Id of fireadmin project
 * @param  {String}  opts.environmentId - Id of fireadmin environment
 * @param  {String}  opts.databaseName - Name of database on which to run (defaults to project base DB)
 * @param  {String}  rtdbPath - Path of RTDB data to get
 * @return {Promise} Resolves with results of RTDB shallow get
 */
export async function shallowRtdbGet(opts, rtdbPath = '') {
  const { projectId, environmentId, databaseName } = opts
  if (!environmentId) {
    throw new Error(
      'environmentId is required for action to authenticate through serviceAccount'
    )
  }
  console.log(`Getting service account from Firestore...`)

  // Make unique app name (prevents issue of multiple apps initialized with same name)
  const appName = `app-${uniqueId()}`
  // Get Service account data from resource (i.e Storage, Firestore, etc)
  const [err, serviceAccount] = await to(
    serviceAccountFromFirestorePath(
      `projects/${projectId}/environments/${environmentId}`,
      appName,
      { returnData: true }
    )
  )

  if (err) {
    console.error(`Error getting service account: ${err.message || ''}`, err)
    throw err
  }
  const client = await authClientFromServiceAccount(serviceAccount)

  const apiUrl = `https://${databaseName ||
    serviceAccount.project_id}.firebaseio.com/${rtdbPath}.json?access_token=${
    client.credentials.access_token
  }`

  try {
    const response = await request(apiUrl)
    console.log(`Firebase REST API Request completed successfully`, response)
    return response.body || response
  } catch (err) {
    console.error(
      `Firebase REST API Responded with an error code: ${err.statusCode} \n ${
        err.error ? err.error.message : ''
      }`
    )
    throw err.error || err
  }
}

/**
 * Load service account file from Cloud Storage, returning local storage path.
 * @param  {String} docPath - Path to Service Account File on Cloud Storage
 * @param  {String} name - Name under which to store local service account file
 * @return {Promise} Resolves with local path of file
 */
export async function serviceAccountFromStoragePath(docPath, name) {
  console.log('Getting service accounts stored in Cloud Storage')
  const localPath = `serviceAccounts/${name}.json`
  const tempLocalPath = path.join(os.tmpdir(), localPath)
  const tempLocalDir = path.dirname(tempLocalPath)
  // Create Temporary directory and download file to that folder
  await mkdirp(tempLocalDir)
  // Download file from bucket to local filesystem
  await admin
    .storage()
    .bucket()
    .file(docPath)
    .download({ destination: tempLocalPath })
  return tempLocalPath
}

/**
 * Load service account data from Cloud storage file (returns file contents as
 * object)
 * @param  {String} docPath - Path to Service Account File on Cloud Storage
 * @param  {String} name - Name under which to store local service account file
 * @return {Promise} Resolves with JS object containg contents of service
 * account file
 */
export async function serviceAccountFileFromStorage(docPath, name) {
  const accountLocalPath = await serviceAccountFromStoragePath(docPath, name)
  return fs.readJson(accountLocalPath)
}

export function cleanupServiceAccounts(appName) {
  const tempLocalPath = path.join(os.tmpdir(), 'serviceAccounts')
  return new Promise((resolve, reject) =>
    rimraf(tempLocalPath, err => (err ? reject(err) : resolve()))
  )
}
