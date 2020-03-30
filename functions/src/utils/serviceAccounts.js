import * as admin from 'firebase-admin'
import os from 'os'
import fsExtra from 'fs-extra'
import fs from 'fs'
import path from 'path'
import google from 'googleapis'
import { get, uniqueId } from 'lodash'
import mkdirp from 'mkdirp-promise'
import { decrypt } from './encryption'
import { to } from './async'
import { hasAll } from './index'
import {
  STORAGE_AND_PLATFORM_SCOPES,
  SERVICE_ACCOUNT_PARAMS,
  MISSING_CRED_ERROR_MSG
} from '../constants/serviceAccount'

/**
 * Get Google APIs auth client. Auth comes from serviceAccount.
 * @return {Promise} Resolves with JWT Auth Client (for attaching to request)
 */
export async function authClientFromServiceAccount(serviceAccount) {
  if (!hasAll(serviceAccount, SERVICE_ACCOUNT_PARAMS)) {
    throw new Error('Invalid service account')
  }
  const jwtClient = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    STORAGE_AND_PLATFORM_SCOPES
  )
  return new Promise((resolve, reject) => {
    jwtClient.authorize((err) => {
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
    console.error(MISSING_CRED_ERROR_MSG)
    throw new Error(MISSING_CRED_ERROR_MSG)
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
    await fsExtra.writeJson(tempLocalPath, serviceAccountData)
    // Return localPath of service account
    return tempLocalPath
  } catch (err) {
    console.error(
      `Error writing service account from Firestore to local file ${
        err.message || ''
      }`,
      err
    )
    throw err
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
  return fsExtra.readJson(accountLocalPath)
}

export async function cleanupServiceAccounts(appName) {
  const tempLocalPath = path.join(os.tmpdir(), 'serviceAccounts')
  if (fs.existsSync(tempLocalPath)) {
    try {
      fs.unlinkSync(tempLocalPath)
    } catch(err) {} // eslint-disable-line

  }
}
