/* eslint-disable no-console */
import * as admin from 'firebase-admin'
import os from 'os'
import fs from 'fs-extra'
import path from 'path'
import { get } from 'lodash'
import mkdirp from 'mkdirp-promise'
const functions = require('firebase-functions')
const gcs = require('@google-cloud/storage')()
const bucket = gcs.bucket(functions.config().firebase.storageBucket)

const serviceAccountGetFuncByType = {
  firestore: serviceAccountFromFirestorePath,
  storage: serviceAccountFromStoragePath
}

export async function getAppsFromEvent(event) {
  const {
    serviceAccount1Path,
    serviceAccount2Path,
    database1URL,
    database2URL,
    serviceAccountType = 'firestore'
  } = event.data.val()
  console.log('Getting apps from event for type:', database2URL, database1URL)
  const getServiceAccount = get(serviceAccountGetFuncByType, serviceAccountType)
  if (!getServiceAccount) {
    const errMessage = 'Invalid service account type in migration request'
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
      'app1'
    ),
    app2: admin.initializeApp(
      {
        credential: admin.credential.cert(account2LocalPath),
        databaseURL: database2URL
      },
      'app2'
    )
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
 * Load service account data from Cloud Storage
 * @param  {String} docPath - Path to Service Account File on Cloud Storage
 * @param  {String} name - Name under which to store local service account file
 * @return {Promise}
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

// const actionBetweenTwoAppInstances = () => () => {
//   const app1 = appFromFirestorePath(serviceAccount1Path, 'app1')
//   const app2 = appFromFirestorePath(serviceAccount2Path, 'app2')
//   return action(app1, app2)
// }
