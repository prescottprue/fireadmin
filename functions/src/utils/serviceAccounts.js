import * as admin from 'firebase-admin'
import os from 'os'
import fsExtra from 'fs-extra'
import path from 'path'
import google from 'googleapis'
import { uniqueId } from 'lodash'
import mkdirp from 'mkdirp'
import { decrypt } from './encryption'
import { to } from './async'
import { hasAll } from './index'

const STORAGE_AND_PLATFORM_SCOPES = [
  'https://www.googleapis.com/auth/devstorage.full_control',
  'https://www.googleapis.com/auth/firebase.database',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/cloud-platform'
]

const SERVICE_ACCOUNT_PARAMS = [
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
 * @param {object} serviceAccount - Service account object
 * @returns {Promise} Resolves with JWT Auth Client (for attaching to request)
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
 * Get Firebase app from request event containing path information for
 * service account
 * @param {object} opts - Options object
 * @param {object} eventData - Data from event request
 * @returns {Promise} Resolves with Firebase app
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
 * @param {string} docPath - Path to Firestore document containing service account
 * @param {string} name - Name under which to store local service account file
 * @param {object} options - Options object
 * @param {boolean} options.returnData - Whether or not to return service account data
 * @returns {Promise} Resolves with service account or path to service account
 */
export async function serviceAccountFromFirestorePath(
  docPath,
  name,
  { returnData = false }
) {
  const projectDoc = await admin.firestore().doc(docPath).get()

  // Handle project not existing in Firestore
  if (!projectDoc.exists) {
    const getProjErr = `Project containing service account not at path: ${docPath}`
    console.error(getProjErr)
    throw new Error(getProjErr)
  }

  // Get serviceAccount parameter from project
  const projectData = projectDoc.data()
  const { credential } = projectData?.serviceAccount || {}

  // Handle credential parameter not existing on doc
  if (!credential) {
    const missingCredErrorMsg =
      'Credential parameter is required to load service account from Firestore'
    console.error(missingCredErrorMsg)
    throw new Error(missingCredErrorMsg)
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
    console.error(
      `Service account not a valid object, serviceAccountStr: "${serviceAccountStr}" err:`,
      err
    )
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
