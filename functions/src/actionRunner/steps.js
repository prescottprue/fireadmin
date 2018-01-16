import * as admin from 'firebase-admin'
import { invoke, get, isArray, size, map } from 'lodash'
import os from 'os'
import path from 'path'
import fs from 'fs-extra'
import mkdirp from 'mkdirp-promise'
import { CUSTOM_STEPS_PATH } from './constants'
import { invokeFirepadContent } from './firepad'
import { to, promiseWaterfall } from '../utils/async'
import { getAppFromServiceAccount } from '../utils/serviceAccounts'
import {
  cleanup,
  updateResponseOnRTDB,
  updateResponseWithProgress,
  updateResponseWithError,
  updateResponseWithActionError
} from './utils'

/**
 * Data action using Service account stored on Firestore
 * @param  {functions.Event} event - Event from cloud function
 * @param  {object|undefined} event.params - Parameters from event
 * @param  {String} event.data.serviceAccountType - Type of service accounts,
 * options include 'firestore', 'storage', or 'rtdb'
 * @return {Promise}
 */
export async function runStepsFromEvent(event) {
  const eventData = invoke(event, 'data.val')
  if (!eventData) {
    throw new Error('Event object does not contain a value.')
  }
  if (!eventData.template) {
    throw new Error('Action template is required to run steps')
  }
  const { inputValues, template: { steps, inputs } } = eventData
  if (!isArray(steps)) {
    updateResponseWithError(event)
    throw new Error('Steps array was not provided to action request')
  }
  if (!isArray(inputs)) {
    updateResponseWithError(event)
    throw new Error('Inputs array was not provided to action request')
  }
  if (!isArray(inputValues)) {
    updateResponseWithError(event)
    throw new Error('Input values array was not provided to action request')
  }
  console.log('Converting inputs of action....')
  const convertedInputValues = await validateAndConvertInputs(
    eventData.inputValues,
    inputs
  )
  const totalNumSteps = size(steps)
  console.log(`Running ${totalNumSteps} actions`, typeof actions)
  // Run all action promises
  const [actionErr, actionResponse] = await to(
    promiseWaterfall(
      map(
        steps,
        createStepRunner({
          convertedInputValues,
          event,
          eventData,
          totalNumSteps
        })
      )
    )
  )
  // Cleanup temp directory
  cleanup()
  if (actionErr) {
    return updateResponseWithError(event)
  }
  // Write response to RTDB
  await updateResponseOnRTDB(event)
  return actionResponse
}

/**
 * Validate and convert list of inputs to relevant types (i.e. serviceAccount
 * data replaced with app)
 * @param  {Array} inputs - List of inputs to convert
 * @return {Promise} Resolves with an array of results of converting inputs
 */
function validateAndConvertInputs(inputsValues, inputsMetas) {
  return Promise.all(
    inputsValues.map((inputValues, inputIdx) =>
      validateAndConvertInputValues(inputValues, get(inputsMetas, inputIdx))
    )
  )
}

/**
 * Validate and convert a single input to relevant type
 * (i.e. serviceAccount data replaced with app)
 * @param  {Object} original - Original input value
 * @return {Promise} Resolves with firebase app if service account type,
 * otherwise an dobject
 */
async function validateAndConvertInputValues(inputValues, inputMeta) {
  if (get(inputMeta, 'type') === 'serviceAccount') {
    if (
      get(inputMeta, 'required') &&
      (!get(inputValues, 'serviceAccountPath') ||
        !get(inputValues, 'databaseURL'))
    ) {
      throw new Error(
        'Input is required and does not contain serviceAccountPath and databaseURL'
      )
    }
    return getAppFromServiceAccount(inputValues)
  }
  if (get(inputMeta, 'required') && !size(inputValues)) {
    throw new Error('Input is required and does not contain a value')
  }
  return inputValues
}

/**
 * Builds an action runner function which accepts an action config object
 * and the stepIdx. Action runner function runs action then updates
 * response with progress and/or error.
 * @param  {Object} eventData - Data from event (contains settings for
 * @param  {Array} inputs - List of inputs
 * @param  {Array} convertedInputValues - List of inputs converted to relevant types
 * @param  {Object} event - Event object from Cloud Trigger
 * @param  {Integer} totalNumSteps - Total number of actions
 * @return {Function} Accepts action and stepIdx (used in Promise.all map)
 */
function createStepRunner({
  inputs,
  convertedInputValues,
  event,
  eventData,
  totalNumSteps
}) {
  /**
   * Recieves results of previous action and calls next action
   * @param  {Any} previousStepResult - result of previous action
   * @return {Function} Accepts action and stepIdx (used in Promise.all map)
   *
   */
  return function runNextStep(previousStepResult) {
    console.log('Running next step...')
    /**
     * Run action based on provided settings and update response with progress
     * @param  {Object} action - Action object containing settings for action
     * @param  {Number} stepIdx - Index of the action (from actions array)
     * @return {Promise} Resolves with results of progress update call
     */
    return async function runStepAndUpdateProgress(step, stepIdx) {
      console.log(`Starting step: ${stepIdx}...`)
      const [err] = await to(
        runStep({
          step,
          convertedInputValues,
          stepIdx,
          eventData,
          previousStepResult
        })
      )
      if (err) {
        await updateResponseWithActionError(event, { totalNumSteps, stepIdx })
        throw new Error(`Error running action: ${stepIdx} : ${err.message}`)
      }
      return updateResponseWithProgress(event, { totalNumSteps, stepIdx })
    }
  }
}

/**
 * Data action using Service account stored on Firestore
 * @param  {Object} step - Object containing settings for step
 * @param  {Array} inputs - Inputs provided to the action
 * @param  {Array} convertedInputValues - Inputs provided to the action converted
 * to relevant data (i.e. service accounts)
 * @param  {Number} stepIdx - Index of the action (from actions array)
 * @param  {Object} eventData - Data from event (contains settings for
 * action request)
 * @return {Promise} Resolves with results of running the provided action
 */
export async function runStep({
  inputs,
  convertedInputValues,
  step,
  stepIdx,
  eventData,
  previousStepResult
}) {
  if (!step) {
    throw new Error('Step object does not contain a value.')
  }
  const { type } = step
  // TODO: Get inputs (i.e. apps from service accounts)
  // Run custom action type (i.e. Code written within Firepad)
  if (type === 'custom') {
    const { templateId } = eventData
    console.log(
      'Step type is "Custom", gathering custom step code from location:',
      `${CUSTOM_STEPS_PATH}/${templateId}/steps/${stepIdx}`
    )
    const rootRef = admin
      .database()
      .ref(`${CUSTOM_STEPS_PATH}/${templateId}/steps/${stepIdx}`)
    const firepadContext = { step, inputs, previous: previousStepResult }
    const res = await invokeFirepadContent(rootRef, { context: firepadContext })
    console.log('Response from executing custom step: ', res)
    return res
  }
  const input1 = get(inputs, '0')
  const input2 = get(inputs, '1')
  const app1 = get(convertedInputValues, '0')
  const app2 = get(convertedInputValues, '1')

  // Require src and dest for all other step types
  if (!input1 || !input2 || !input1.resource || !input2.resource) {
    throw new Error(
      'input1, input2 and input1.resource are required to run step'
    )
  }

  switch (input1.resource) {
    case 'firestore':
      if (input2.resource === 'firestore') {
        await copyBetweenFirestoreInstances(app1, app2, step)
      } else if (input2.resource === 'rtdb') {
        await copyFromFirestoreToRTDB(app1, app2, step)
      } else {
        throw new Error(
          `Invalid input2.resource: ${input2.resource} for step: ${step}`
        )
      }
      break
    case 'rtdb':
      if (input2.resource === 'firestore') {
        await copyFromRTDBToFirestore(app1, app2, step)
      } else if (input2.resource === 'rtdb') {
        await copyBetweenRTDBInstances(app1, app2, step)
      } else {
        throw new Error(
          `Invalid input2.resource: ${input2.resource} for step: ${step}`
        )
      }
      break
    case 'storage':
      if (input2.resource === 'rtdb') {
        await copyFromStorageToRTDB(app1, app2, step)
      } else {
        throw new Error(
          `Invalid input2.resource: ${input2.resource} for step: ${step}`
        )
      }
      break
    default:
      throw new Error(
        'input1.resource type not supported. Try firestore, rtdb, or storage'
      )
  }
  console.log('Step successful!')
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
  const localPath = `actions/storage/${pathInStorage}/${Date.now()}.json`
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
