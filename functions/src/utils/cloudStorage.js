import os from 'os'
import path from 'path'
import fs from 'fs-extra'
import mkdirp from 'mkdirp-promise'
const gcs = require('@google-cloud/storage')()

const functionsConfig = JSON.parse(process.env.FIREBASE_CONFIG)

/**
 * Download JSON File from Google Cloud Storage and return is contents
 * @param  {firebase.App} app - App from which the storage File should be downloaded
 * @param  {String} pathInStorage - Path of file within cloud storage bucket
 * @return {Promise} Resolves with JSON contents of the file
 */
export async function downloadFromStorage(app, pathInStorage) {
  if (app && !app.storage) {
    throw new Error('Storage is not enabled on firebase-admin')
  }
  // Handle default app
  const bucket = !app
    ? gcs.bucket(functionsConfig.storageBucket)
    : app.storage().bucket
  const localPath = `actions/storage/${pathInStorage}/${Date.now()}.json`
  const tempLocalPath = path.join(os.tmpdir(), localPath)
  const tempLocalDir = path.dirname(tempLocalPath)
  try {
    // Create Temporary directory and download file to that folder
    await mkdirp(tempLocalDir)
    // Download file from bucket to local filesystem
    await bucket.file(pathInStorage).download({ destination: tempLocalPath })
    // Return JSON file contents
    const fileContents = await fs.readJson(tempLocalPath)
    // Once the file data has been read, remove local files to free up disk space
    fs.unlinkSync(tempLocalPath)
    return fileContents
  } catch (err) {
    console.error('Error downloading file from storage', err.message || err)
    throw err
  }
}

/**
 * Upload JSON Object to Google Cloud Storage and return is contents
 * @param  {firebase.App} app - App from which the storage File should be downloaded
 * @param  {String} pathInStorage - Path of file within cloud storage bucket
 * @return {Promise} Resolves with JSON contents of the file
 */
export async function uploadToStorage(app, pathInStorage, jsonObject) {
  const localPath = `actions/storage/${Date.now()}/${pathInStorage}.json`
  const tempLocalPath = path.join(os.tmpdir(), localPath)
  if (!app.storage) {
    throw new Error('Storage is not enabled on firebase-admin')
  }
  try {
    // Upload file from bucket to local filesystem
    await fs.outputJson(tempLocalPath, jsonObject, { spaces: 2 })
    await app
      .storage()
      .bucket()
      .upload(tempLocalPath, {
        destination: pathInStorage,
        contentType: 'application/json',
        contentLanguage: 'en'
      })
    // Return JSON file contents
  } catch (err) {
    console.error('Error uploading file to storage', err.message || err)
    throw err
  }
}
