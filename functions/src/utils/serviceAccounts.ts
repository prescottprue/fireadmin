import * as admin from 'firebase-admin'
import path from 'path'
import google from 'googleapis'
import { uniqueId } from 'lodash'
import { decrypt } from './encryption'
import { to } from './async'
import { hasAll } from './index'
import { ActionRunnerEventData } from '../actionRunner/types'
import { PROJECTS_COLLECTION } from '../constants/firebasePaths'

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

export interface ServiceAccount {
  type: string
  project_id: string
  private_key_id: string
  private_key: string
  client_email: string
  client_id: string
  auth_uri: string
  token_ur: string
}

interface ClientObj {
  credentials: { token_type: string, access_token: string }
}

/**
 * Get Google APIs auth client. Auth comes from serviceAccount.
 * @param serviceAccount - Service account object
 * @returns Resolves with JWT Auth Client (for attaching to request)
 */
export async function authClientFromServiceAccount(serviceAccount: ServiceAccount): Promise<ClientObj> {
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
 * @param opts - Options object
 * @param eventData - Data from event request
 * @returns Resolves with Firebase app
 */
export async function getAppFromServiceAccount(opts, eventData: ActionRunnerEventData): Promise<admin.app.App> {
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

  // Get Service account data from resource (i.e Storage, Firestore, etc)
  const [err, accountFilePath] = await to(
    serviceAccountFromFirestorePath(
      `${PROJECTS_COLLECTION}/${projectId}/environments/${id || environmentKey}`
    )
  )

  if (err) {
    console.error(`Error getting service account: ${err.message || ''}`, err)
    throw err
  }

  try {
    const appCreds: any = {
      credential: admin.credential.cert(accountFilePath),
      databaseURL
    }
    if (storageBucket) {
      appCreds.storageBucket = storageBucket
    }
    // Make unique app name (prevents issue of multiple apps initialized with same name)
    const appName = `app-${uniqueId()}`
    return admin.initializeApp(appCreds, appName)
  } catch (err) {
    console.error('Error initializing firebase app:', err.message || err)
    throw err
  }
}

/**
 * Load service account data From Firestore
 * @param docPath - Path to Firestore document containing service account
 * @param options - Options object
 * @param options.returnData - Whether or not to return service account data
 * @returns Resolves with service account or path to service account
 */
export async function serviceAccountFromFirestorePath(
  docPath: string
): Promise<any> {
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

  // Return service account data if specified by options
  return serviceAccountData
}
