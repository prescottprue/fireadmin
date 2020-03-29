import { invoke, get, chunk, isObject } from 'lodash'
import { batchCopyBetweenFirestoreRefs } from './utils'
import { downloadFromStorage, uploadToStorage } from '../utils/cloudStorage'
import { to, promiseWaterfall } from '../utils/async'
import { slashPathToFirestoreRef, dataByIdSnapshot } from '../utils/firestore'
import { shallowRtdbGet } from '../utils/rtdb'

/**
 * Copy data between Firestore instances from two different Firebase projects
 * @param  {firebase.App} app1 - First app for the action
 * @param  {firebase.App} app2 - Second app for the action
 * @param  {Object} eventData - Data from event (contains settings)
 * @return {Promise} Resolves with result of update call
 */
export async function copyBetweenFirestoreInstances(
  app1,
  app2,
  eventData,
  inputValues
) {
  const { merge = true, subcollections } = eventData
  const srcPath = inputValueOrTemplatePath(eventData, inputValues, 'src')
  const destPath = inputValueOrTemplatePath(eventData, inputValues, 'dest')
  // Get Firestore references from slash paths (handling both doc and collection)
  const srcRef = slashPathToFirestoreRef(app1.firestore(), srcPath)
  const destRef = slashPathToFirestoreRef(app2.firestore(), destPath)

  // Copy from src ref to dest ref with support for merging and subcollections
  const [copyErr, writeRes] = await to(
    batchCopyBetweenFirestoreRefs({
      srcRef,
      destRef,
      subcollections,
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
 * @param  {firebase.App} app1 - First app for the action
 * @param  {firebase.App} app2 - Second app for the action
 * @param  {Object} eventData - Data from event (contains settings)
 * @return {Promise} Resolves with result of update call
 */
export async function copyFromFirestoreToRTDB(
  app1,
  app2,
  eventData,
  inputValues
) {
  const firestore1 = app1.firestore()
  const secondRTDB = app2.database()
  const destPath = inputValueOrTemplatePath(eventData, inputValues, 'dest')
  const srcPath = inputValueOrTemplatePath(eventData, inputValues, 'src')
  // Get Firestore instance from slash path (handling both doc and collection)
  const srcRef = slashPathToFirestoreRef(firestore1, srcPath)
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
 * @param  {firebase.App} app1 - First app for the action
 * @param  {firebase.App} app2 - Second app for the action
 * @param  {Object} eventData - Data from event (contains settings)
 * @return {Promise} Resolves with result of update call
 */
export async function copyFromRTDBToFirestore(
  app1,
  app2,
  eventData,
  inputValues
) {
  const firestore2 = app2.firestore()
  const firstRTDB = app1.database()
  const destPath = inputValueOrTemplatePath(eventData, inputValues, 'dest')
  const srcPath = inputValueOrTemplatePath(eventData, inputValues, 'src')
  try {
    const dataSnapFromFirst = await firstRTDB.ref(srcPath).once('value')
    const dataFromFirst = invoke(dataSnapFromFirst, 'val')
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
 * @param  {Object} templateStep - Step from which to get pathType and fallback
 * paths.
 * @param  {Array} inputValues - Converted input values
 * @param  {String} [location='src'] - Path location (i.e. src/dest)
 * @return {String} Inputs value or path provided within template's step
 */
function inputValueOrTemplatePath(templateStep, inputValues, location = 'src') {
  return get(templateStep, `${location}.pathType`) === 'input'
    ? get(inputValues, get(templateStep, `${location}.path`))
    : get(templateStep, `${location}.path`)
}

/**
 * Copy data between Firebase Realtime Database Instances
 * @param  {firebase.App} app1 - First app for the action
 * @param  {firebase.App} app2 - Second app for the action
 * @param  {Object} eventData - Data from event (contains settings)
 * @return {Promise} Resolves with result of update call
 */
export async function copyBetweenRTDBInstances(
  app1,
  app2,
  eventData,
  inputValues
) {
  if (!get(app1, 'database') || !get(app2, 'database')) {
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
    const dataFromFirst = invoke(dataSnapFromFirst, 'val')

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
 * @param  {firebase.App} app1 - First app for the action
 * @param  {firebase.App} app2 - Second app for the action
 * @param  {Object} eventData - Data from event (contains settings)
 * @return {Promise} Resolves with result of update call
 */
export async function copyPathBetweenRTDBInstances(
  app1,
  app2,
  srcPath,
  destPath
) {
  if (!get(app1, 'database') || !get(app2, 'database')) {
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
    const dataFromFirst = invoke(dataSnapFromFirst, 'val')

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
 * @param  {firebase.App} app1 - First app for the action
 * @param  {firebase.App} app2 - Second app for the action
 * @param  {Object} eventData - Data from event (contains settings)
 * @return {Promise} Resolves with result of update call
 */
export async function batchCopyBetweenRTDBInstances(
  app1,
  app2,
  step,
  inputValues,
  eventData
) {
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
 * @param  {firebase.App} app1 - First app for the action
 * @param  {firebase.App} app2 - Second app for the action
 * @param  {Object} eventData - Data from event (contains settings)
 * @return {Promise} Resolves with result of update call
 */
export async function copyFromStorageToRTDB(app1, app2, eventData) {
  if (!get(app1, 'database') || !get(app2, 'database')) {
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
 * @param  {firebase.App} app1 - First app for the action
 * @param  {firebase.App} app2 - Second app for the action
 * @param  {Object} eventData - Data from event (contains settings)
 * @return {Promise} Resolves with result of update call
 */
export async function copyFromRTDBToStorage(app1, app2, eventData) {
  if (!get(app1, 'database')) {
    throw new Error('Invalid service account, database not defined on app1')
  }
  const { src, dest } = eventData
  try {
    const firstRTDB = app1.database()
    const firstDataSnap = await firstRTDB.ref(src.path).once('value')
    const firstDataVal = invoke(firstDataSnap, 'val')
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
