import * as admin from 'firebase-admin'
import { get, chunk, isObject, size } from 'lodash'
import { batchCopyBetweenFirestoreRefs } from './utils'
import { downloadFromStorage, uploadToStorage } from '../utils/cloudStorage'
import { to, promiseWaterfall } from '../utils/async'
import { isDocPath } from '../utils/firestore'
import { shallowRtdbGet } from './utils'
import { ActionStep, ActionRunnerEventData } from './types'

/**
 * Create data object with values for each document with keys being doc.id.
 * @param snap - Data for which to create
 * an ordered array.
 * @returns Object documents from snapshot or null
 */
function dataByIdSnapshot(snap) {
  const data = {}
  if (snap.data && snap.exists) {
    data[snap.id] = snap.data()
  } else if (snap.forEach) {
    snap.forEach((doc) => {
      data[doc.id] = doc.data() || doc
    })
  }
  return size(data) ? data : null
}

/**
 * Copy data between Firestore instances from two different Firebase projects
 * @param app1 - First app for the action
 * @param app2 - Second app for the action
 * @param eventData - Data from event (contains settings)
 * @param inputValues - Values of inputs
 * @returns Resolves with result of update call
 */
export async function copyBetweenFirestoreInstances(
  app1: admin.app.App,
  app2: admin.app.App,
  eventData: ActionStep,
  inputValues: any[]
) {
  const { merge = true, subcollections } = eventData
  const srcPath = inputValueOrTemplatePath(eventData, inputValues, 'src')
  const destPath = inputValueOrTemplatePath(eventData, inputValues, 'dest')
  const dataPathMethod = isDocPath(srcPath) ? 'doc' : 'collection'

  // Get Firestore references from slash paths (handling both doc and collection)
  const srcRef = app1.firestore()[dataPathMethod](srcPath)
  const destRef = app2.firestore()[dataPathMethod](destPath)

  // Copy from src ref to dest ref with support for merging and subcollections
  const [copyErr, writeRes] = await to(
    batchCopyBetweenFirestoreRefs({
      srcRef,
      destRef,
      opts: { merge, copySubcollections: subcollections }
    })
  )

  // Handle errors copying between Firestore Refs
  if (copyErr) {
    console.error('Error copying data between Firestore refs: ', {
      message: copyErr.message || copyErr,
      srcPath,
      destPath
    })
    throw copyErr
  }

  console.log('Copy between Firestore instances successful!')

  return writeRes
}

/**
 * Copy data from Cloud Firestore to Firebase Real Time Database
 * @param app1 - First app for the action
 * @param app2 - Second app for the action
 * @param eventData - Data from event (contains settings)
 * @param inputValues - Values of inputs
 * @returns Resolves with result of update call
 */
export async function copyFromFirestoreToRTDB(
  app1: admin.app.App,
  app2: admin.app.App,
  eventData: ActionStep,
  inputValues: any[]
): Promise<any> {
  const firestore1 = app1.firestore()
  const secondRTDB = app2.database()
  const destPath = inputValueOrTemplatePath(eventData, inputValues, 'dest')
  const srcPath = inputValueOrTemplatePath(eventData, inputValues, 'src')

  // Get Firestore instance from slash path (handling both doc and collection)
  const dataPathMethod = isDocPath(srcPath) ? 'doc' : 'collection'
  const srcRef = firestore1[dataPathMethod](srcPath)

  // Get data from first instance
  const [getErr, firstSnap] = await to(srcRef.get())

  // Handle errors getting original data
  if (getErr) {
    console.error(
      `Error getting data from first firestore instance: ${
        getErr.message || ''
      }`,
      getErr
    )
    throw getErr
  }

  // Get data into array (regardless of single doc or collection)
  const dataFromSrc = dataByIdSnapshot(firstSnap)

  // Handle no data within provided source path
  if (!dataFromSrc) {
    const noDataErr = 'No data exists within source path'
    console.error(noDataErr)
    throw new Error(noDataErr)
  }

  // Write data to destination RTDB path
  const [updateErr] = await to(secondRTDB.ref(destPath).update(dataFromSrc))

  // Handle errors writing data to destination RTDB
  if (updateErr) {
    console.error(
      'Error copying from Firestore to RTDB',
      updateErr.message || updateErr
    )
    throw updateErr
  }

  console.log('Copy from Firestore to RTDB successful!')

  return null
}

/**
 * Copy data from Real Time Database to Cloud Firestore
 * @param app1 - First app for the action
 * @param app2 - Second app for the action
 * @param eventData - Data from event (contains settings)
 * @param inputValues - Values of inputs
 * @returns Resolves with result of update call
 */
export async function copyFromRTDBToFirestore(
  app1: admin.app.App,
  app2: admin.app.App,
  eventData: ActionStep,
  inputValues: any[]
) {
  const firestore2 = app2.firestore()
  const firstRTDB = app1.database()
  const destPath = inputValueOrTemplatePath(eventData, inputValues, 'dest')
  const srcPath = inputValueOrTemplatePath(eventData, inputValues, 'src')
  try {
    const dataSnapFromFirst = await firstRTDB.ref(srcPath).once('value')
    const dataFromFirst = dataSnapFromFirst.val()
    const updateRes = await firestore2.doc(destPath).update(dataFromFirst)
    console.log('Copy from RTDB to Firestore successful')
    return updateRes
  } catch (err) {
    console.error('Error copying from RTDB to Firestore', err.message || err)
    throw err
  }
}

/**
 * Get input value if pathtype is input otherwise get path value from template
 * @param templateStep - Step from which to get pathType and fallback paths.
 * @param inputValues - Converted input values
 * @param [location='src'] - Path location (i.e. src/dest)
 * @returns Inputs value or path provided within template's step
 */
function inputValueOrTemplatePath(templateStep: ActionStep, inputValues: any[], location = 'src'): any {
  return get(templateStep, `${location}.pathType`) === 'input'
    ? get(inputValues, get(templateStep, `${location}.path`))
    : get(templateStep, `${location}.path`)
}

/**
 * Copy data between Firebase Realtime Database Instances
 * @param app1 - First app for the action
 * @param app2 - Second app for the action
 * @param eventData - Data from event (contains settings)
 * @param inputValues - Converted input values
 * @returns Resolves with result of update call
 */
export async function copyBetweenRTDBInstances(
  app1: admin.app.App,
  app2: admin.app.App,
  eventData: ActionStep,
  inputValues: any[]
): Promise<null> {
  if (!app1?.database || !app2?.database) {
    console.error('Database not found on app instance')
    throw new Error('Invalid service account, does not have access to database')
  }
  try {
    const firstRTDB = app1.database()
    const secondRTDB = app2.database()
    const destPath = inputValueOrTemplatePath(eventData, inputValues, 'dest')
    const srcPath = inputValueOrTemplatePath(eventData, inputValues, 'src')

    // Handle source path not being provided
    if (!srcPath) {
      const noSrcPathErr =
        'Copying whole database is not currently supported, please provide a source path.'
      console.warn('Attempted to copy whole database, throwing an error')
      throw new Error(noSrcPathErr)
    }
    // Load data from first database
    const dataSnapFromFirst = await firstRTDB.ref(srcPath).once('value')
    const dataFromFirst = dataSnapFromFirst.val()

    // Handle data not existing in source database
    if (!dataFromFirst) {
      const errorMessage =
        'Path does not exist in Source Real Time Database Instance'
      console.error(errorMessage)
      throw new Error(errorMessage)
    }
    const writeMethod = isObject(dataFromFirst) ? 'update' : 'set'

    // Update second database with data from first datbase
    await secondRTDB.ref(destPath)[writeMethod](dataFromFirst)

    console.log('Copy between RTDB instances successful')

    return null
  } catch (err) {
    console.log('Error copying between RTDB instances', err.message || err)
    throw err
  }
}

/**
 * Copy data between Firebase Realtime Database Instances
 * @param app1 - First app for the action
 * @param app2 - Second app for the action
 * @param srcPath - Data source path
 * @param destPath - Data destination path
 * @returns Resolves with result of update call
 */
export async function copyPathBetweenRTDBInstances(
  app1: admin.app.App,
  app2: admin.app.App,
  srcPath: string,
  destPath: string
): Promise<null> {
  if (!app1?.database || !app2?.database) {
    console.error('Database not found on app instance')
    throw new Error('Invalid service account, does not have access to database')
  }
  try {
    const firstRTDB = app1.database()
    const secondRTDB = app2.database()

    // Handle source path not being provided
    if (!srcPath) {
      const noSrcPathErr =
        'Copying whole database is not currently supported, please provide a source path.'
      console.warn('Attempted to copy whole database, throwing an error')
      throw new Error(noSrcPathErr)
    }
    // Load data from first database
    const dataSnapFromFirst = await firstRTDB.ref(srcPath).once('value')
    const dataFromFirst = dataSnapFromFirst.val()

    // Handle data not existing in source database
    if (!dataFromFirst) {
      const errorMessage =
        'Path does not exist in Source Real Time Database Instance'
      console.error(errorMessage)
      throw new Error(errorMessage)
    }
    const writeMethod = isObject(dataFromFirst) ? 'update' : 'set'

    // Update second database with data from first datbase
    await secondRTDB.ref(destPath || srcPath)[writeMethod](dataFromFirst)

    return null
  } catch (err) {
    console.log('Error copying between RTDB instances', err.message || err)
    throw err
  }
}

const DEFAULT_RTDB_BATCH_SIZE = 50

/**
 * Copy data between Firebase Realtime Database Instances in batches (suited for large data sets)
 * @param app1 - First app for the action
 * @param app2 - Second app for the action
 * @param step - Current step
 * @param inputValues - Converted input values
 * @param eventData - Data from event (contains settings)
 * @returns Resolves with result of update call
 */
export async function batchCopyBetweenRTDBInstances(
  app1: admin.app.App,
  app2: admin.app.App,
  step: ActionStep,
  inputValues: any[],
  eventData: ActionRunnerEventData
): Promise<void> {
  // TODO: Support passing in chunk size (it will have to be validated)
  const chunkSize = DEFAULT_RTDB_BATCH_SIZE

  const srcPath = inputValueOrTemplatePath(step, inputValues, 'src')
  const destPath = inputValueOrTemplatePath(step, inputValues, 'dest')
  const { projectId, environmentValues = [] } = eventData

  // TODO: Look into a smarter way to get environmentId since first may not always be source
  const shallowConfig = { projectId, environmentId: environmentValues[0] }
  // Call Firebase REST API using shallow: true to get a list of keys to chunk into groups
  const shallowResults = await shallowRtdbGet(shallowConfig, srcPath)

  // Handle source path not being provided
  if (!srcPath) {
    const noSrcPathErr =
      'Copying whole database is not currently supported, please provide a source path.'
    console.warn('Attempted to copy whole database, throwing an error')
    throw new Error(noSrcPathErr)
  }

  const keysChunks = chunk(Object.keys(shallowResults), chunkSize)

  await promiseWaterfall(
    keysChunks.map((keyChunk, i) => {
      console.log(`Copying key chunk: "${i}" from path: "${srcPath}"`)
      return Promise.all(
        keyChunk.map((rtdbKey) =>
          copyPathBetweenRTDBInstances(
            app1,
            app2,
            `${srcPath}/${rtdbKey}`,
            `${destPath}/${rtdbKey}`
          )
        )
      )
    })
  )

  console.log('Batch copy between RTDB instances successful')
}

/**
 * Copy JSON from Firebase Real Time Database to Google Cloud Storage
 * @param app1 - First app for the action
 * @param app2 - Second app for the action
 * @param eventData - Data from event (contains settings)
 * @returns Resolves with result of update call
 */
export async function copyFromStorageToRTDB(app1: admin.app.App, app2: admin.app.App, eventData: ActionStep) {
  if (!app1?.database || !app2?.database) {
    throw new Error('Invalid service account, database not defined on app')
  }
  const secondRTDB = app2.database()
  const { src, dest } = eventData
  try {
    const dataFromFirst = await downloadFromStorage(app1, src.path)
    const updateRes = await secondRTDB.ref(dest.path).update(dataFromFirst)
    console.log('Copy from Storage to RTDB was successful')
    return updateRes
  } catch (err) {
    console.log('Error copying from storage instances', err.message || err)
    throw err
  }
}

/**
 * Copy JSON from Cloud Storage to Firebase Real Time Database
 * @param app1 - First app for the action
 * @param app2 - Second app for the action
 * @param eventData - Data from event (contains settings)
 * @returns Resolves with result of update call
 */
export async function copyFromRTDBToStorage(app1: admin.app.App, app2: admin.app.App, eventData: ActionStep) {
  if (!app1?.database) {
    throw new Error('Invalid service account, database not defined on app1')
  }
  const { src, dest } = eventData
  try {
    const firstRTDB = app1.database()
    const firstDataSnap = await firstRTDB.ref(src.path).once('value')
    const firstDataVal = firstDataSnap.val()
    if (!firstDataVal) {
      throw new Error('Data not found at provided path')
    }
    await uploadToStorage(app2, dest.path, firstDataVal)
    console.log('copy from RTDB to Storage was successful')
  } catch (err) {
    console.log('Error copying from RTDB to Storage: ', err.message || err)
    throw err
  }
}
