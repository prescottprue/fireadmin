import fs from 'fs-extra'
import os from 'os'
import path from 'path'
import * as admin from 'firebase-admin'
import mkdirp from 'mkdirp-promise'
const functions = require('firebase-functions')
const gcs = require('@google-cloud/storage')()
const bucket = gcs.bucket(functions.config().firebase.storageBucket)

const eventPathName = 'fileToDb'

/**
 * @name storageFileToRTDB
 * Convert a JSON file from storage bucket into a data on RTDB
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref(`/requests/${eventPathName}/{pushId}`)
  .onCreate(copyFileToRTDB)

async function copyFileToRTDB(event) {
  const eventData = event.data.val()
  const { filePath, databasePath, keepPushKey = false } = eventData
  const tempLocalFile = path.join(os.tmpdir(), filePath)
  const tempLocalDir = path.dirname(tempLocalFile)
  await mkdirp(tempLocalDir)
  // Create Temporary directory and download file to that folder
  await bucket.file(filePath).download({ destination: tempLocalFile })
  // Read the file
  const fileData = await fs.readJson(filePath)
  console.log('File data loaded, writing to database', event.data.val())
  // Write File data to DB
  await event.data.adminRef.ref.root
    .child(`${databasePath}/${keepPushKey ? event.params.pushId : ''}`)
    .set(fileData)
  // Mark request as complete
  await event.data.adminRef.ref.root
    .child(`responses/${eventPathName}/${event.params.pushId}`)
    .set({
      completed: true,
      completedAt: admin.database.ServerValue.TIMESTAMP
    })
  console.log('Copying data to DB, cleaning up...')
  // Once the file data hase been added to db delete the local files to free up disk space.
  fs.unlinkSync(tempLocalFile)
  return filePath
}
