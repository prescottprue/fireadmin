import * as admin from 'firebase-admin'
import { invoke, get, isArray, size, map } from 'lodash'
import os from 'os'
import path from 'path'
import fs from 'fs-extra'
import mkdirp from 'mkdirp-promise'
import { invokeFirepadContent } from './firepad'
import { to } from '../utils/async'
import {
  cleanup,
  updateResponseOnRTDB,
  updateResponseWithProgress,
  updateResponseWithError,
  updateResponseWithActionError
} from './utils'

const paths = {
  customMigrationActions: 'migrationTemplates'
}

/**
 * Data migration using Service account stored on Firestore
 * @param  {functions.Event} event - Event from cloud function
 * @param  {object|undefined} event.params - Parameters from event
 * @param  {String} event.data.serviceAccountType - Type of service accounts,
 * options include 'firestore', 'storage', or 'rtdb'
 * @return {Promise}
 */
export async function runMigrationWithApps(app1, app2, event) {
  const eventData = invoke(event, 'data.val')
  if (!eventData) {
    throw new Error('Event object does not contain a value.')
  }
  const { actions } = eventData
  if (!isArray(actions)) {
    updateResponseWithError(event)
    throw new Error('Actions array was not provided to migration request')
  }
  const totalNumActions = size(actions)
  console.log(`Running ${totalNumActions} actions`, typeof actions)
  // Run all action promises
  await Promise.all(
    map(
      actions,
      createActionRunner({ app1, app2, event, eventData, totalNumActions })
    )
  )
  cleanup()
  return updateResponseOnRTDB(event)
}

/**
 * Builds an action runner function which accepts an action config object
 * and the actionIdx. Action runner function runs action then updates
 * response with progress and/or error.
 * @param  {firebase.App} app1 - First app for the action
 * @param  {firebase.App} app2 - Second app for the action
 * @param  {Object} eventData - Data from event (contains settings for
 * @param  {Object} event - Event object from Cloud Trigger
 * @param  {Integer} totalNumActions - Total number of actions
 * @return {Function} Accepts action and actionIdx (used in Promise.all map)
 */
function createActionRunner({ app1, app2, event, eventData, totalNumActions }) {
  /**
   * Run action based on provided settings and update response with progress
   * @param  {Object} action - Action object containing settings for action
   * @param  {Number} actionIdx - Index of the action (from actions array)
   * @return {Promise} Resolves with results of progress update call
   */
  return async function runActionAndUpdateProgress(action, actionIdx) {
    const [err] = await to(
      runAction({ app1, app2, action, actionIdx, eventData })
    )
    if (err) {
      await to(
        updateResponseWithActionError(event, { totalNumActions, actionIdx })
      )
      throw new Error(`Error running action: ${actionIdx} : ${err.message}`)
    }
    return updateResponseWithProgress(event, { totalNumActions, actionIdx })
  }
}

/**
 * Data migration using Service account stored on Firestore
 * @param  {firebase.App} app1 - First app for the action
 * @param  {firebase.App} app2 - Second app for the action
 * @param  {Object} action - Action object containing settings for action
 * @param  {Number} actionIdx - Index of the action (from actions array)
 * @param  {Object} eventData - Data from event (contains settings for
 * migration request)
 * @return {Promise} Resolves with results of running the provided action
 */
export async function runAction({ app1, app2, action, actionIdx, eventData }) {
  if (!action) {
    throw new Error('Event object does not contain a value.')
  }
  const { src, dest, type } = action

  // Run custom action type (i.e. Code written within Firepad)
  if (type === 'custom') {
    const { templateId } = eventData
    console.log(
      'Data backup complete. Looking for custom action in location:',
      `${paths.customMigrationActions}/${templateId}/actions/${actionIdx}`
    )
    const rootRef = admin
      .database()
      .ref(`${paths.customMigrationActions}/${templateId}/actions/${actionIdx}`)
    return invokeFirepadContent(rootRef)
  }

  // Require src and dest for all other action types
  if (!src || !dest || !src.resource || !dest.resource) {
    throw new Error('src, dest and src.resource are required to run migration')
  }

  switch (src.resource) {
    case 'firestore':
      if (dest.resource === 'firestore') {
        await copyBetweenFirestoreInstances(app1, app2, action)
      } else if (dest.resource === 'rtdb') {
        await copyFromFirestoreToRTDB(app1, app2, action)
      } else {
        throw new Error(
          `Invalid dest.resource: ${dest.resource} for event: ${action}`
        )
      }
      break
    case 'rtdb':
      if (dest.resource === 'firestore') {
        await copyFromRTDBToFirestore(app1, app2, action)
      } else if (dest.resource === 'rtdb') {
        await copyBetweenRTDBInstances(app1, app2, action)
      } else {
        throw new Error(
          `Invalid dest.resource: ${dest.resource} for event: ${action}`
        )
      }
      break
    case 'storage':
      if (dest.resource === 'rtdb') {
        await copyFromStorageToRTDB(app1, app2, action)
      } else {
        throw new Error(
          `Invalid dest.resource: ${dest.resource} for event: ${action}`
        )
      }
      break
    default:
      throw new Error(
        'src.resource type not supported. Try firestore, rtdb, or storage'
      )
  }
  console.log(
    'Migration successful, cleaning up and updating response within Real Time DB'
  )
}

/**
 * Copy data between Firestore instances with different service accounts
 * @param  {firebase.App} app1 - First app for the action
 * @param  {firebase.App} app2 - Second app for the action
 * @param  {Object} eventData - Data from event (contains settings)
 * @return {Promise} Resolves with result of update call
 */
async function copyBetweenFirestoreInstances(app1, app2, eventData) {
  const firestore1 = app1.firestore()
  const firestore2 = app2.firestore()
  const { src, dest } = eventData
  try {
    const dataFromFirst = await firestore1.doc(src.path).get()
    const updateRes = await firestore2.doc(dest.path).update(dataFromFirst)
    console.log('Copy between Firestore instances successful')
    return updateRes
  } catch (err) {
    console.log('Error copying between Firestore instances', err.message || err)
    throw err
  }
}

/**
 * Copy data from Cloud Firestore to Firebase Real Time Database
 * @param  {firebase.App} app1 - First app for the action
 * @param  {firebase.App} app2 - Second app for the action
 * @param  {Object} eventData - Data from event (contains settings)
 * @return {Promise} Resolves with result of update call
 */
async function copyFromFirestoreToRTDB(app1, app2, eventData) {
  const firestore1 = app1.firestore()
  const secondRTDB = app2.database()
  const { src, dest } = eventData
  try {
    const dataFromFirst = await firestore1.doc(src.path).get()
    const updateRes = await secondRTDB.ref(dest.path).update(dataFromFirst)
    console.log('copy between firestore instances successful')
    return updateRes
  } catch (err) {
    console.log('error copying from Firestore to RTDB', err.message || err)
    throw err
  }
}

/**
 * Copy data from Real Time Database to Cloud Firestore
 * @param  {firebase.App} app1 - First app for the action
 * @param  {firebase.App} app2 - Second app for the action
 * @param  {Object} eventData - Data from event (contains settings)
 * @return {Promise} Resolves with result of update call
 */
async function copyFromRTDBToFirestore(app1, app2, eventData) {
  const firestore2 = app2.firestore()
  const firstRTDB = app1.database()
  const { src, dest } = eventData
  try {
    const dataSnapFromFirst = await firstRTDB.ref(src.path).once('value')
    const dataFromFirst = invoke(dataSnapFromFirst, 'val')
    const updateRes = await firestore2.doc(dest.path).update(dataFromFirst)
    console.log('Copy from RTDB to Firestore successful')
    return updateRes
  } catch (err) {
    console.log('Error copying from RTDB to Firestore', err.message || err)
    throw err
  }
}

/**
 * Copy data between Firebase Realtime Database Instances
 * @param  {firebase.App} app1 - First app for the action
 * @param  {firebase.App} app2 - Second app for the action
 * @param  {Object} eventData - Data from event (contains settings)
 * @return {Promise} Resolves with result of update call
 */
async function copyBetweenRTDBInstances(app1, app2, eventData) {
  if (!get(app1, 'database') || !get(app2, 'database')) {
    console.error('Database not found on app instance')
    throw new Error(
      'Invalid service account, does not enable access to database'
    )
  }
  const firstRTDB = app1.database()
  const secondRTDB = app2.database()
  const { src, dest } = eventData
  try {
    const dataSnapFromFirst = await firstRTDB.ref(src.path).once('value')
    const dataFromFirst = invoke(dataSnapFromFirst, 'val')
    if (!dataFromFirst) {
      const errorMessage = 'Path does not exist in First source database'
      console.error(errorMessage)
      throw new Error(errorMessage)
    }
    const updateRes = await secondRTDB.ref(dest.path).update(dataFromFirst)
    console.log('Copy between RTDB instances successful')
    return updateRes
  } catch (err) {
    console.log('Error copying between RTDB instances', err.message || err)
    throw err
  }
}

/**
 * Download JSON File from Google Cloud Storage and return is contents
 * @param  {firebase.App} app - App from which the storage File should be downloaded
 * @param  {String} pathInStorage - Path of file within cloud storage bucket
 * @return {Promise} Resolves with JSON contents of the file
 */
async function downloadFromStorage(app, pathInStorage) {
  const localPath = `migrations/storage/${pathInStorage}/${Date.now()}.json`
  const tempLocalPath = path.join(os.tmpdir(), localPath)
  const tempLocalDir = path.dirname(tempLocalPath)
  if (!app.storage) {
    throw new Error('Storage is not enabled on firebase-admin')
  }
  try {
    // Create Temporary directory and download file to that folder
    await mkdirp(tempLocalDir)
    // Download file from bucket to local filesystem
    await app
      .storage()
      .bucket.file(pathInStorage)
      .download({ destination: tempLocalPath })
    // Return JSON file contents
    return fs.readJson(tempLocalPath)
  } catch (err) {
    console.error('Error downloading file from storage', err.message || err)
    throw err
  }
}

/**
 * Copy JSON from Cloud Storage to Firebase Real Time Database
 * @param  {firebase.App} app1 - First app for the action
 * @param  {firebase.App} app2 - Second app for the action
 * @param  {Object} eventData - Data from event (contains settings)
 * @return {Promise} Resolves with result of update call
 */
async function copyFromStorageToRTDB(app1, app2, eventData) {
  if (!get(app1, 'database') || !get(app2, 'database')) {
    throw new Error('Invalid service account, database not defined on app')
  }
  const secondRTDB = app2.database()
  const { src, dest } = eventData
  try {
    const dataFromFirst = await downloadFromStorage(app1, src.path)
    const updateRes = await secondRTDB.ref(dest.path).update(dataFromFirst)
    console.log('copy from Storage to RTDB was successful')
    return updateRes
  } catch (err) {
    console.log('error copying between firestore instances', err.message || err)
    throw err
  }
}
