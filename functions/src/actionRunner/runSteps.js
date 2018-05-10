import * as admin from 'firebase-admin'
import { get, isArray, size, map, isObject } from 'lodash'
import { CUSTOM_STEPS_PATH } from './constants'
import { invokeFirepadContent } from './firepad'
import {
  copyFromRTDBToFirestore,
  copyFromFirestoreToRTDB,
  copyBetweenFirestoreInstances,
  copyFromStorageToRTDB,
  copyBetweenRTDBInstances,
  copyFromRTDBToStorage
} from './actions'
import { to, promiseWaterfall } from '../utils/async'
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
 * @param  {functions.Event} snap - Event from cloud function
 * @param  {Object} context
 * @param  {Object} context.params - Parameters from event
 * @return {Promise}
 */
export async function runStepsFromEvent(snap, context) {
  const eventData = snap.val()
  if (!eventData) {
    throw new Error('Event object does not contain a value.')
  }

  if (!isObject(eventData.template)) {
    throw new Error('Action template is required to run steps')
  }

  const {
    inputValues,
    environments,
    template: { steps, inputs }
  } = eventData

  if (!isArray(steps)) {
    await updateResponseWithError(snap, context)
    throw new Error('Steps array was not provided to action request')
  }

  if (!isArray(inputs)) {
    await updateResponseWithError(snap, context)
    throw new Error('Inputs array was not provided to action request')
  }

  if (!isArray(inputValues)) {
    await updateResponseWithError(snap, context)
    throw new Error('Input values array was not provided to action request')
  }

  const [convertEnvsErr, convertedEnvs] = await to(
    validateAndConvertEnvironments(eventData, environments)
  )

  if (convertEnvsErr) {
    console.error('Error converting envs:', convertEnvsErr.message)
    throw convertEnvsErr
  }

  console.log('Converting inputs of step....')

  const [convertInputsErr, convertedInputValues] = await to(
    validateAndConvertInputs(eventData, inputs)
  )

  if (convertInputsErr) {
    console.error('Error converting inputs:', convertInputsErr.message)
    throw convertInputsErr
  }
  const totalNumSteps = size(steps)
  console.log(`Running ${totalNumSteps} steps(s)`)
  // Run all action promises
  const [actionErr, actionResponse] = await to(
    promiseWaterfall(
      map(
        steps,
        createStepRunner({
          inputs,
          convertedInputValues,
          convertedEnvs,
          snap,
          context,
          eventData,
          totalNumSteps
        })
      )
    )
  )
  // Cleanup temp directory
  cleanupServiceAccounts()
  if (actionErr) {
    await updateResponseWithError(snap, context)
    throw actionErr
  }
  // Write response to RTDB
  await updateResponseOnRTDB(snap, context)
  return actionResponse
}

/**
 * Data action using Service account stored on Firestore
 * @param  {functions.Event} event - Event from cloud function
 * @param  {object|undefined} event.params - Parameters from event
 * @param  {String} event.data.serviceAccountType - Type of service accounts,
 * options include 'firestore', 'storage', or 'rtdb'
 * @return {Promise}
 */
export async function runBackupsFromEvent(snap, context) {
  const eventData = snap.val()
  if (!eventData) {
    throw new Error('Event object does not contain a value.')
  }
  if (!isObject(eventData.template)) {
    throw new Error('Action template is required to run steps')
  }
  const {
    inputValues,
    template: { backups, inputs }
  } = eventData
  if (!isArray(backups)) {
    await updateResponseWithError(snap, context)
    throw new Error('Steps array was not provided to action request')
  }
  if (!isArray(inputs)) {
    await updateResponseWithError(snap, context)
    throw new Error('Inputs array was not provided to action request')
  }
  if (!isArray(inputValues)) {
    await updateResponseWithError(snap, context)
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
  const totalNumSteps = size(backups)
  console.log(`Running ${totalNumSteps} backup(s)`)
  // Run all action promises
  const [actionErr, actionResponse] = await to(
    promiseWaterfall(
      map(
        backups,
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
    await updateResponseWithError(snap, context)
    throw actionErr
  }
  // Write response to RTDB
  await updateResponseOnRTDB(snap, context)
  return actionResponse
}

/**
 * Validate and convert list of inputs to relevant types (i.e. serviceAccount
 * data replaced with app)
 * @param  {Array} inputs - List of inputs to convert
 * @return {Promise} Resolves with an array of results of converting inputs
 */
function validateAndConvertEnvironments(eventData, envsMetas, event) {
  if (!eventData.environments) {
    return []
  }
  return Promise.all(
    eventData.environments.map((envValue, envIdx) =>
      validateAndConvertEnvironment(eventData, get(envsMetas, envIdx), envValue)
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
async function validateAndConvertEnvironment(eventData, inputMeta, inputValue) {
  // Throw if input is required and is missing serviceAccountPath or databaseURL
  const varsNeededForStorageType = ['fullPath', 'databaseURL']
  const varsNeededForFirstoreType = ['credential', 'databaseURL']
  if (
    get(inputMeta, 'required') &&
    !hasAll(inputValue, varsNeededForStorageType) &&
    !hasAll(inputValue, varsNeededForFirstoreType)
  ) {
    throw new Error(
      'Service Account input is required and does not contain required parameters'
    )
  }

  return getAppFromServiceAccount(inputValue, eventData)
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
  convertedEnvs,
  snap,
  context,
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
          convertedEnvs,
          stepIdx,
          eventData,
          previousStepResult
        })
      )
      if (err) {
        await updateResponseWithActionError(snap, context, {
          totalNumSteps,
          stepIdx
        })
        throw new Error(`Error running step: ${stepIdx} : ${err.message}`)
      }
      await updateResponseWithProgress(snap, context, {
        totalNumSteps,
        stepIdx
      })
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
  convertedEnvs,
  step,
  stepIdx,
  eventData,
  previousStepResult
}) {
  // Handle step or step type not existing
  if (!step || !step.type) {
    throw new Error('Step object is invalid (i.e. does not contain a type)')
  }

  if (!convertedEnvs) {
    throw new Error('Environments are required to run step')
  }
  const { type, src, dest } = step

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

  // Service accounts come from converted version of what is selected for inputs
  const app1 = get(convertedEnvs, '0')
  const app2 = get(convertedEnvs, '1')

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
