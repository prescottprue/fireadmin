/* eslint-disable no-console */
import * as admin from 'firebase-admin'
import os from 'os'
import fs from 'fs-extra'
import path from 'path'
import { get, uniqueId } from 'lodash'
import mkdirp from 'mkdirp-promise'
const functions = require('firebase-functions')
const gcs = require('@google-cloud/storage')()
const bucket = gcs.bucket(functions.config().firebase.storageBucket)

const serviceAccountGetFuncByType = {
  firestore: serviceAccountFromFirestorePath,
  storage: serviceAccountFromStoragePath
}

/**
 * Get Firebase app objects from Cloud Function event object.
 * @param  {Object} event - Function event object containing service account
 * paths
 * @return {Promise} Resolves with an object containing app1 and app2
 */
export async function getAppsFromEvent(event) {
  const {
    serviceAccount1Path,
    serviceAccount2Path,
    database1URL,
    database2URL,
    serviceAccountType = 'storage'
  } = event.data.val()
  console.log(
    `Getting apps from service accounts from ${serviceAccountType}...`
  )
  const getServiceAccount = get(serviceAccountGetFuncByType, serviceAccountType)
  if (!getServiceAccount) {
    const errMessage = 'Invalid service account type in action request'
    console.error(errMessage)
    throw new Error(errMessage)
  }
  const account1LocalPath = await serviceAccountFromStoragePath(
    serviceAccount1Path,
    'app1'
  )
  const account2LocalPath = await serviceAccountFromStoragePath(
    serviceAccount2Path,
    'app2'
  )
  return {
    app1: admin.initializeApp(
      {
        credential: admin.credential.cert(account1LocalPath),
        databaseURL: database1URL
      },
      `app1-${uniqueId()}`
    ),
    app2: admin.initializeApp(
      {
        credential: admin.credential.cert(account2LocalPath),
        databaseURL: database2URL
      },
      `app2-${uniqueId()}`
    )
  }
}

export async function getAppFromServiceAccount(opts) {
  const {
    databaseURL,
    serviceAccountPath,
    serviceAccountType = 'storage'
  } = opts
  console.log(`Getting apps from service account from ${serviceAccountType}...`)
  const getServiceAccount = get(serviceAccountGetFuncByType, serviceAccountType)
  if (!getServiceAccount) {
    const errMessage = 'Invalid service account type in action request'
    console.error(errMessage)
    throw new Error(errMessage)
  }
  // Make unique app name (prevents issue of multiple apps initialized with same name)
  const appName = `app-${uniqueId()}`
  // Get Service account data from resource (i.e Storage, Firestore, etc)
  const account1LocalPath = await getServiceAccount(serviceAccountPath, appName)
  return admin.initializeApp(
    {
      credential: admin.credential.cert(account1LocalPath),
      databaseURL
    },
    appName
  )
}

/**
 * Load service account data From Firestore
 * @param  {String} docPath - Path to Firestore document containing service
 * account
 * @param  {String} name - Name under which to store local service account file
 * @return {Promise}
 */
export async function serviceAccountFromFirestorePath(docPath, name) {
  const firestore = admin.firestore()
  const serviceAccountData = await firestore.doc(docPath).get()
  const localPath = `serviceAccounts/${name}.json`
  const tempLocalPath = path.join(os.tmpdir(), localPath)
  const tempLocalDir = path.dirname(tempLocalPath)
  await mkdirp(tempLocalDir)
  await fs.writeJson(tempLocalPath, serviceAccountData.serviceAccount)
  return tempLocalPath
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
