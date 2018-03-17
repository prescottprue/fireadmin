import { invoke, get } from 'lodash'
import { downloadFromStorage, uploadToStorage } from '../utils/cloudStorage'
import {
  slashPathToFirestoreRef,
  dataArrayFromSnap,
  writeDocsInBatches
} from './utils'
import { to } from '../utils/async'

/**
 * Copy data between Firestore instances with different service accounts
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
  const firestore1 = app1.firestore()
  const firestore2 = app2.firestore()
  const { merge = true } = eventData
  const srcPath = inputValueOrTemplatePath(eventData, inputValues, 'src')
  // Get Firestore instance from slash path (handling both doc and collection)
  const srcRef = slashPathToFirestoreRef(firestore1, srcPath)
  // Get data from first instance
  const [getErr, firstSnap] = await to(srcRef.get())
  // Handle errors getting original data
  if (getErr) {
    console.error(
      'Error getting data from first instance: ',
      getErr.message || getErr
    )
    throw getErr
  }
  // Get data into array (regardless of single doc or collection)
  const dataFromSrc = dataArrayFromSnap(firstSnap)
  if (!dataFromSrc) {
    console.error('No data exists within source path')
    throw new Error('No data exists within source path')
  }
  const destPath = inputValueOrTemplatePath(eventData, inputValues, 'dest')
  // Run in multiple batches if there are more that 500 documents since
  // batch processes are limited to 500 documents
  const [writeErr, writeRes] = await to(
    writeDocsInBatches(firestore2, destPath, dataFromSrc, { merge })
  )
  // Handle errors running write action
  if (writeErr) {
    console.error(
      'Error getting data from first instance: ',
      writeErr.message || writeErr
    )
    throw writeErr
  }
  console.log('Copy between Firestore instances successful')
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
  try {
    const dataFromFirst = await firestore1.doc(srcPath).get()
    const updateRes = await secondRTDB.ref(destPath).update(dataFromFirst)
    console.log('Copy from Firestore to RTDB successful')
    return updateRes
  } catch (err) {
    console.error('Error copying from Firestore to RTDB', err.message || err)
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
    throw new Error(
      'Invalid service account, does not enable access to database'
    )
  }
  try {
    const firstRTDB = app1.database()
    const secondRTDB = app2.database()
    const destPath = inputValueOrTemplatePath(eventData, inputValues, 'dest')
    const srcPath = inputValueOrTemplatePath(eventData, inputValues, 'src')
    const dataSnapFromFirst = await firstRTDB.ref(srcPath).once('value')
    const dataFromFirst = invoke(dataSnapFromFirst, 'val')
    if (!dataFromFirst) {
      const errorMessage =
        'Path does not exist in Source Real Time Database Instance'
      console.error(errorMessage)
      throw new Error(errorMessage)
    }
    const updateRes = await secondRTDB.ref(destPath).update(dataFromFirst)
    console.log('Copy between RTDB instances successful')
    return updateRes
  } catch (err) {
    console.log('Error copying between RTDB instances', err.message || err)
    throw err
  }
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
