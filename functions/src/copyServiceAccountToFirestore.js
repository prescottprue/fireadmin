/* eslint-disable no-console */
import fs from 'fs-extra'
import os from 'os'
import path from 'path'
import { uniqueId } from 'lodash'
const functions = require('firebase-functions')
const gcs = require('@google-cloud/storage')()
const bucket = gcs.bucket(functions.config().firebase.storageBucket)

/**
 * @name copyServiceAccountToFirestore
 * Copy service account to Firestore from Cloud Storage when new service
 * account meta data is added to Firestore
 * @type {functions.CloudFunction}
 */
export default functions.firestore
  .document(
    'projects/{projectId}/environments/{envrionmentId}'
    // 'projects/{projectId}/environments/{envrionmentId}/serviceAccounts/{serviceAccountId}' // for serviceAccounts as subcollection
  )
  .onCreate(handleServiceAccountCreate)

/**
 * Handle downloading service account from cloud storage and store it within
 * Firestore. Could be a storage function, but it would require more code
 * due to being triggered for all storage files.
 * @param  {functions.Event} event - Function event triggered when adding a new
 * service account to a project
 * @return {Promise} Resolves with filePath
 */
async function handleServiceAccountCreate(event) {
  // const { fullPath } = event.data.data() // for serviceAccounts as subcollection
  console.log('service account copying to firestore')
  const eventData = event.data.data()
  const tempSuffix = `copyServiceAccount/${uniqueId()}/serviceAccount.json`
  const tempLocalPath = path.join(os.tmpdir(), tempSuffix)
  const { serviceAccount: { fullPath } } = eventData
  // const fileName = path.basename(fullPath) // File Name
  await bucket.file(fullPath).download({ destination: tempLocalPath })
  // Create Temporary directory and download file to that folder
  const fileData = await fs.readJson(tempLocalPath)
  // Write File data to Service account
  await event.data.ref.update({ credential: fileData })
  console.log('Service account copied to Firestore, cleaning up...')
  // Once the file data hase been added to db delete the local files to free up disk space.
  fs.unlinkSync(tempLocalPath)
  return tempLocalPath
}
