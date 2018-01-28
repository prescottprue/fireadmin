/* eslint-disable no-console */
import * as admin from 'firebase-admin'
import os from 'os'
import fs from 'fs-extra'
import path from 'path'
import rimraf from 'rimraf'
import { get, uniqueId } from 'lodash'
import mkdirp from 'mkdirp-promise'
import { decrypt } from './encryption'
const functions = require('firebase-functions')
const gcs = require('@google-cloud/storage')()
const bucket = gcs.bucket(functions.config().firebase.storageBucket)

const serviceAccountGetFuncByType = {
  firestore: serviceAccountFromFirestorePath,
  storage: serviceAccountFromStoragePath
}

export async function getAppFromServiceAccount(opts) {
  const {
    databaseURL,
    storageBucket,
    serviceAccountPath,
    serviceAccountType = 'firestore'
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
  const appCreds = {
    credential: admin.credential.cert(account1LocalPath),
    databaseURL
  }
  if (storageBucket) {
    appCreds.storageBucket = storageBucket
  }
  return admin.initializeApp(appCreds, appName)
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
    const missingCredMsg =
      'Credential parameter is required to load service account from Firestore'
    console.error(missingCredMsg)
    throw new Error(missingCredMsg)
  }
  const serviceAccountStr = decrypt(credential)
  console.log('service account string:', serviceAccountStr)
  const localPath = `serviceAccounts/${name}.json`
  const tempLocalPath = path.join(os.tmpdir(), localPath)
  const tempLocalDir = path.dirname(tempLocalPath)
  await mkdirp(tempLocalDir)
  await fs.writeJson(tempLocalPath, JSON.parse(serviceAccountStr))
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

export function cleanupServiceAccounts(appName) {
  const tempLocalPath = path.join(os.tmpdir(), 'serviceAccounts')
  return new Promise((resolve, reject) =>
    rimraf(tempLocalPath, err => (err ? reject(err) : resolve()))
  )
}
