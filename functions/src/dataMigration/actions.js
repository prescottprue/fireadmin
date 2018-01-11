import * as admin from 'firebase-admin'
import safeEval from 'safe-eval'
import { invoke, get, isArray, size, map } from 'lodash'
import os from 'os'
import path from 'path'
import fs from 'fs-extra'
import mkdirp from 'mkdirp-promise'
import { getFirepadContent } from './firepad'
import { to } from '../utils/async'
import {
  cleanup,
  updateResponseOnRTDB,
  updateResponseWithProgress,
  updateResponseWithError,
  updateResponseWithActionError
} from './utils'
const functions = require('firebase-functions')

const paths = {
  customMigrationActions: 'migrationTemplates'
}

/**
 * Data migration using Service account stored on Firestore
 * @param  {functions.Event} event - Event from cloud function
 * @param  {object|undefined} event.params - Parameters from event
 * @param  {String} event.data.serviceAccountType - Type of service accounts, options
 * include 'firestore', 'storage', or 'rtdb'
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

function createActionRunner({ app1, app2, event, eventData, totalNumActions }) {
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
 * @param  {functions.Event} event - Event from cloud function
 * @param  {object|undefined} event.params - Parameters from event
 * @param  {String} event.data.serviceAccountType - Type of service accounts, options
 * include 'firestore', 'storage', or 'rtdb'
 * @return {Promise}
 */
export async function runAction({ app1, app2, action, actionIdx, eventData }) {
  console.log('running action:', action)
  if (!action) {
    throw new Error('Event object does not contain a value.')
  }
  const { src, dest, type } = action

  if (type === 'custom') {
    const { templateId } = eventData
    console.log(
      'Data backup complete. Looking for custom action in location:',
      `${paths.customMigrationActions}/${templateId}/actions/${actionIdx}`
    )
    const rootRef = admin
      .database()
      .ref(`${paths.customMigrationActions}/${templateId}/actions/${actionIdx}`)
    const firepadContent = await getFirepadContent(rootRef)
    if (!firepadContent) {
      console.log('Custom mapping not found. Skipping.')
      return action
    }
    console.log(
      'Content loaded from Firepad. Evaluating within function context...'
    )
    const evalContext = { console, functions, admin }
    return safeEval(firepadContent, evalContext)
  }

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

async function copyBetweenFirestoreInstances(app1, app2, eventData) {
  console.log('starting copyBetweenFirestoreInstances', eventData)
  const firestore1 = app1.firestore()
  const firestore2 = app2.firestore()
  const { src, dest } = eventData
  try {
    const dataFromFirst = await firestore1.doc(src.path).get()
    await firestore2.doc(dest.path).update(dataFromFirst)
    console.log('copy between firestore instances was successful')
  } catch (err) {
    console.log('error copying between firestore instances')
  }
}

async function copyFromFirestoreToRTDB(app1, app2, eventData) {
  console.log('starting copyFromFirestoreToRTDB', eventData)
  const firestore1 = app1.firestore()
  const secondRTDB = app2.database()
  const { src, dest } = eventData
  try {
    const dataFromFirst = await firestore1.doc(src.path).get()
    await secondRTDB.ref(dest.path).update(dataFromFirst)
    console.log('copy between firestore instances was successful')
  } catch (err) {
    console.log('error copying between firestore instances')
  }
}

async function copyFromRTDBToFirestore(app1, app2, eventData) {
  console.log('starting copyFromRTDBToFirestore', eventData)
  const firestore2 = app2.firestore()
  const firstRTDB = app1.database()
  const { src, dest } = eventData
  try {
    const dataSnapFromFirst = await firstRTDB.ref(src.path).once('value')
    const dataFromFirst = invoke(dataSnapFromFirst, 'val')
    await firestore2.doc(dest.path).update(dataFromFirst)
    console.log('copy between firestore instances was successful')
  } catch (err) {
    console.log('error copying between firestore instances')
  }
}

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
    await secondRTDB.ref(dest.path).update(dataFromFirst)
    console.log('copy between database instances was successful')
  } catch (err) {
    console.log('error copying between firestore instances', err.message || err)
    throw err
  }
}

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
    console.log('Download of file complete, parsing JSON')
    const parsedJson = await fs.readJson(tempLocalPath)
    console.log('JSON from Storage parsed successfully')
    return parsedJson
  } catch (err) {
    console.error('Error downloading file from storage', err.message || err)
    throw err
  }
}

async function copyFromStorageToRTDB(app1, app2, eventData) {
  if (!get(app1, 'database') || !get(app2, 'database')) {
    console.log('database not found')
    throw new Error('Invalid service account')
  }
  const secondRTDB = app2.database()
  const { src, dest } = eventData
  try {
    const dataFromFirst = await downloadFromStorage(app1, src.path)
    await secondRTDB.ref(dest.path).update(dataFromFirst)
    console.log('copy from Storage to RTDB was successful')
  } catch (err) {
    console.log('error copying between firestore instances', err.message || err)
    throw err
  }
}
