import * as admin from 'firebase-admin'
import { invoke, get, isArray, size, map, isObject } from 'lodash'
import { CUSTOM_STEPS_PATH } from './constants'
import { invokeFirepadContent } from './firepad'
import { to, promiseWaterfall } from '../utils/async'
import { downloadFromStorage, uploadToStorage } from '../utils/cloudStorage'
import { hasAll } from '../utils/index'
import {
  getAppFromServiceAccount,
  cleanupServiceAccounts
} from '../utils/serviceAccounts'
import {
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
  if (!isObject(eventData.template)) {
    throw new Error('Action template is required to run steps')
  }
  const { inputValues, template: { steps, inputs } } = eventData
  if (!isArray(steps)) {
    await updateResponseWithError(event)
    throw new Error('Steps array was not provided to action request')
  }
  if (!isArray(inputs)) {
    await updateResponseWithError(event)
    throw new Error('Inputs array was not provided to action request')
  }
  if (!isArray(inputValues)) {
    await updateResponseWithError(event)
    throw new Error('Input values array was not provided to action request')
  }
  console.log('Converting inputs of action....')
  const [convertInputsErr, convertedInputValues] = await to(
    validateAndConvertInputs(eventData, inputs)
  )
  if (convertInputsErr) {
    console.error('Error converting inputs:', convertInputsErr.message)
    throw convertInputsErr
  }
  const totalNumSteps = size(steps)
  console.log(`Running ${totalNumSteps} actions`)
  // Run all action promises
  const [actionErr, actionResponse] = await to(
    promiseWaterfall(
      map(
        steps,
        createStepRunner({
          inputs,
          convertedInputValues,
          event,
          eventData,
          totalNumSteps
        })
      )
    )
  )
  // Cleanup temp directory
  cleanupServiceAccounts()
  if (actionErr) {
    await updateResponseWithError(event)
    throw actionErr
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
function validateAndConvertInputs(eventData, inputsMetas, event) {
  return Promise.all(
    eventData.inputValues.map((inputValue, inputIdx) =>
      validateAndConvertInputValues(
        eventData,
        get(inputsMetas, inputIdx),
        inputValue
      )
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
async function validateAndConvertInputValues(eventData, inputMeta, inputValue) {
  // Convert service account path and databaseURL to a Firebase App
  if (get(inputMeta, 'type') === 'serviceAccount') {
    // Throw if input is required and is missing serviceAccountPath or databaseURL
    const missingParamsForAccountFromStorage = !hasAll(inputValue, [
      'fullPath',
      'databaseURL'
    ])
    const missingParamsForAccountFromFirstore = !hasAll(inputValue, [
      'credential',
      'databaseURL'
    ])
    if (
      get(inputMeta, 'required') &&
      missingParamsForAccountFromStorage &&
      missingParamsForAccountFromFirstore
    ) {
      throw new Error(
        'Service Account input is required and does not contain required parameters'
      )
    }

    return getAppFromServiceAccount(inputValue, eventData)
  }
  if (get(inputMeta, 'pathType') === 'userInput') {
    console.log('type of input is user input. Returning input value', {
      inputMeta,
      inputValue
    })
    return inputValue
  }
  if (get(inputMeta, 'required') && !size(inputValue)) {
    throw new Error('Input is required and does not contain a value')
  }
  return inputValue
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
   * Run action based on provided settings and update response with progress
   * @param  {Object} action - Action object containing settings for action
   * @param  {Number} stepIdx - Index of the action (from actions array)
   * @return {Promise} Resolves with results of progress update call
   */
  return function runStepAndUpdateProgress(step, stepIdx) {
    /**
     * Recieves results of previous action and calls next action
     * @param  {Any} previousStepResult - result of previous action
     * @return {Function} Accepts action and stepIdx (used in Promise.all map)
     */
    return async function runNextStep(previousStepResult) {
      const [err, stepResponse] = await to(
        runStep({
          step,
          inputs,
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
      await updateResponseWithProgress(event, { totalNumSteps, stepIdx })
      return stepResponse
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
  // Handle step or step type not existing
  if (!step || !step.type) {
    throw new Error('Step object is invalid (i.e. does not contain a type)')
  }
  const { type } = step

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
    return res
  }

  // TODO: Enable dynamic src/dest by getting data from convertedInputValues
  // Source/Dest info loaded from step
  const src = get(step, 'src')
  const dest = get(step, 'dest')

  // Service accounts come from converted version of what is selected for inputs
  const app1 = get(convertedInputValues, '0')
  const app2 = get(convertedInputValues, '1')

  // Require src and dest for all other step types
  if (!src || !dest || !src.resource || !dest.resource) {
    throw new Error('src, dest and src.resource are required to run step')
  }

  switch (src.resource) {
    case 'firestore':
      if (dest.resource === 'firestore') {
        return copyBetweenFirestoreInstances(
          app1,
          app2,
          step,
          convertedInputValues
        )
      } else if (dest.resource === 'rtdb') {
        return copyFromFirestoreToRTDB(app1, app2, step, convertedInputValues)
      } else {
        throw new Error(
          `Invalid dest.resource: ${dest.resource} for step: ${step}`
        )
      }
    case 'rtdb':
      if (dest.resource === 'firestore') {
        return copyFromRTDBToFirestore(app1, app2, step, convertedInputValues)
      } else if (dest.resource === 'rtdb') {
        return copyBetweenRTDBInstances(app1, app2, step, convertedInputValues)
      } else if (dest.resource === 'storage') {
        return copyFromRTDBToStorage(app1, app2, step, convertedInputValues)
      } else {
        throw new Error(
          `Invalid dest.resource: ${dest.resource} for step: ${step}`
        )
      }
    case 'storage':
      if (dest.resource === 'rtdb') {
        return copyFromStorageToRTDB(app1, app2, step, convertedInputValues)
      } else {
        throw new Error(
          `Invalid dest.resource: ${dest.resource} for step: ${step}`
        )
      }
    default:
      throw new Error(
        'src.resource type not supported. Try firestore, rtdb, or storage'
      )
  }
}

/**
 * Copy data between Firestore instances with different service accounts
 * @param  {firebase.App} app1 - First app for the action
 * @param  {firebase.App} app2 - Second app for the action
 * @param  {Object} eventData - Data from event (contains settings)
 * @return {Promise} Resolves with result of update call
 */
async function copyBetweenFirestoreInstances(
  app1,
  app2,
  eventData,
  inputValues
) {
  const firestore1 = app1.firestore()
  const firestore2 = app2.firestore()
  const { merge = true } = eventData
  const destPath = inputValueOrTemplatePath(eventData, inputValues, 'dest')
  const srcPath = inputValueOrTemplatePath(eventData, inputValues, 'src')
  try {
    const dataFromFirst = await firestore1.doc(srcPath).get()
    const updateRes = await firestore2
      .doc(destPath)
      .set(dataFromFirst, { merge })
    console.log('Copy between Firestore instances successful')
    return updateRes
  } catch (err) {
    console.error(
      'Error copying between Firestore instances',
      err.message || err
    )
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
async function copyFromFirestoreToRTDB(app1, app2, eventData, inputValues) {
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
async function copyFromRTDBToFirestore(app1, app2, eventData, inputValues) {
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
async function copyBetweenRTDBInstances(app1, app2, eventData, inputValues) {
  if (!get(app1, 'database') || !get(app2, 'database')) {
    console.error('Database not found on app instance')
    throw new Error(
      'Invalid service account, does not enable access to database'
    )
  }
  const firstRTDB = app1.database()
  const secondRTDB = app2.database()
  const destPath = inputValueOrTemplatePath(eventData, inputValues, 'dest')
  const srcPath = inputValueOrTemplatePath(eventData, inputValues, 'src')
  console.log('src path: ', srcPath)
  console.log('dest path: ', destPath)
  try {
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

/**
 * Copy JSON from Cloud Storage to Firebase Real Time Database
 * @param  {firebase.App} app1 - First app for the action
 * @param  {firebase.App} app2 - Second app for the action
 * @param  {Object} eventData - Data from event (contains settings)
 * @return {Promise} Resolves with result of update call
 */
async function copyFromRTDBToStorage(app1, app2, eventData) {
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
