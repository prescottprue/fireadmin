/* eslint-disable no-console */
import * as admin from 'firebase-admin'
import os from 'os'
import fs from 'fs-extra'
import path from 'path'
import rimraf from 'rimraf'
import { get, uniqueId } from 'lodash'
import mkdirp from 'mkdirp-promise'
import { decrypt } from './encryption'
import { to } from './async'
const functions = require('firebase-functions')
const gcs = require('@google-cloud/storage')()
const bucket = gcs.bucket(functions.config().firebase.storageBucket)

const serviceAccountGetFuncByType = {
  firestore: serviceAccountFromFirestorePath,
  storage: serviceAccountFromStoragePath
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
  const {
    databaseURL,
    storageBucket,
    environmentKey,
    fullPath,
    serviceAccountType = 'firestore',
    fallbackAccountType = 'storage'
  } = opts
  if (!databaseURL) {
    throw new Error(
      'databaseURL is required for action to authenticate through serviceAccount'
    )
  }
  const { projectId } = eventData
  let serviceAccountPath = fullPath
  let accountFilePath
  let accountDataPath
  console.log(`Getting apps from service account from ${serviceAccountType}...`)
  if (environmentKey && serviceAccountType === 'firestore') {
    accountDataPath = `projects/${projectId}/environments/${environmentKey}`
  }
  const getServiceAccount = get(serviceAccountGetFuncByType, serviceAccountType)
  // Throw for service account type that does not have a getter function
  if (!getServiceAccount) {
    const errMessage = 'Invalid service account type in action request'
    console.error(errMessage)
    throw new Error(errMessage)
  }
  // Make unique app name (prevents issue of multiple apps initialized with same name)
  const appName = `app-${uniqueId()}`
  // Get Service account data from resource (i.e Storage, Firestore, etc)
  const [err, firstAccountFilePath] = await to(
    getServiceAccount(accountDataPath || serviceAccountPath, appName)
  )
  if (!err) {
    accountFilePath = firstAccountFilePath
  } else {
    // Attempt to get fallback account type if main does not exist
    console.log(
      `Service account for app: "${appName}" could not be loaded from ${serviceAccountType} loading from ${fallbackAccountType} instead...`
    )
    if (err.message === missingCredMsg) {
      const getFallbackServiceAccount = get(
        serviceAccountGetFuncByType,
        fallbackAccountType
      )
      const [err2, fallbackAccountFilePath] = await to(
        getFallbackServiceAccount(
          fallbackAccountType === 'firestore'
            ? accountDataPath
            : serviceAccountPath,
          appName
        )
      )
      if (err2) {
        console.log(
          `Service account for app: "${appName}" could also not be loaded from ${fallbackAccountType}. Exiting...`
        )
        throw new Error(
          `Service account could not be loaded for app: "${appName}"`
        )
      }
      accountFilePath = fallbackAccountFilePath
    }
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
export async function serviceAccountFromFirestorePath(docPath, name) {
  console.log('Getting service accounts stored in Firestore')
  const firestore = admin.firestore()
  const projectDoc = await firestore.doc(docPath).get()
  if (!projectDoc.exists) {
    console.error('Project containing service account not found')
    throw new Error('Project containing service account not found')
  }
  const projectData = projectDoc.data()
  const { credential } = get(projectData, 'serviceAccount', {})
  if (!credential) {
    console.error(missingCredMsg)
    throw new Error(missingCredMsg)
  }
  const serviceAccountStr = decrypt(credential)
  const localPath = `serviceAccounts/${name}.json`
  const tempLocalPath = path.join(os.tmpdir(), localPath)
  const tempLocalDir = path.dirname(tempLocalPath)
  try {
    await mkdirp(tempLocalDir)
    await fs.writeJson(tempLocalPath, JSON.parse(serviceAccountStr))
    return tempLocalPath
  } catch (err) {
    console.error('Error getting service account form Firestore')
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
  await bucket.file(docPath).download({ destination: tempLocalPath })
  console.log('File downloaded locally to', tempLocalPath)
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
