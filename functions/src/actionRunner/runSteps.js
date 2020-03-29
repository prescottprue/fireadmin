import { get, isArray, size, map, isObject } from 'lodash'
import {
  copyFromRTDBToFirestore,
  copyFromFirestoreToRTDB,
  copyBetweenFirestoreInstances,
  copyFromStorageToRTDB,
  copyBetweenRTDBInstances,
  copyFromRTDBToStorage,
  batchCopyBetweenRTDBInstances
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
 * @param  {functions.database.DataSnapshot} snap - Data snapshot from cloud function
 * @param  {functions.EventContext} context - The context in which an event occurred
 * @param  {Object} context.params - Parameters from event
 * @return {Promise}
 */
export async function runStepsFromEvent(snap, context) {
  const eventData = snap.val()
  if (!eventData) {
    throw new Error('Run action request does not contain a value.')
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

  const convertedEnvs = await validateAndConvertEnvironments(
    eventData,
    environments
  )

  // Convert inputs into their values
  const convertedInputValues = validateAndConvertInputs(eventData, inputs)

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

  // Handle errors running action
  if (actionErr) {
    // Write error back to RTDB response object
    await updateResponseWithError(snap, context)
    throw actionErr
  }

  // Write response to RTDB
  await updateResponseOnRTDB(snap, context)

  return actionResponse
}

/**
 * Data action using Service account stored on Firestore
 * @param  {functions.database.DataSnapshot} snap - Data snapshot from cloud function
 * @param  {functions.EventContext} context - The context in which an event occurred
 * @param  {Object} context.params - Parameters from event
 * @return {Promise}
 */
export async function runBackupsFromEvent(snap, context) {
  const eventData = snap.val()
  const {
    inputValues,
    template: { backups, inputs }
  } = eventData
  if (!isArray(backups)) {
    await updateResponseWithError(snap, context)
    throw new Error('Backups array was not provided to action request')
  }

  if (!isArray(inputs)) {
    await updateResponseWithError(snap, context)
    throw new Error('Inputs array was not provided to action request')
  }

  if (!isArray(inputValues)) {
    await updateResponseWithError(snap, context)
    throw new Error('Input values array was not provided to action request')
  }

  const convertedInputValues = validateAndConvertInputs(eventData, inputs)

  const totalNumSteps = size(backups)
  console.log(`Running ${totalNumSteps} backup(s)`)

  // Run all action promises in a waterfall
  const [actionErr, actionResponse] = await to(
    promiseWaterfall(
      map(
        backups,
        createStepRunner({
          inputs,
          convertedInputValues,
          snap,
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
    return Promise.resolve([])
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
      'Environment input is required and does not contain required parameters'
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
  return eventData.inputValues.map((inputValue, inputIdx) =>
    validateAndConvertInputValues(get(inputsMetas, inputIdx), inputValue)
  )
}

/**
 * Validate and convert a single input to relevant type
 * (i.e. serviceAccount data replaced with app)
 * @param  {Object} original - Original input value
 * @return {Promise} Resolves with firebase app if service account type,
 * otherwise an dobject
 */
function validateAndConvertInputValues(inputMeta, inputValue) {
  // Handle no longer supported input type "serviceAccount"
  if (get(inputMeta, 'type') === 'serviceAccount') {
    console.error('serviceAccount inputMeta type still being used: ', inputMeta)
    throw new Error(
      'serviceAccount input type is no longer supported. Please update your action template'
    )
  }

  // Confirm required inputs have a value
  if (get(inputMeta, 'required') && !size(inputValue)) {
    throw new Error('Input is required and does not contain a value')
  }

  // Return input's value (assuming userInput type)
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
      // Handle errors running step
      if (err) {
        // Write error back to response object
        await updateResponseWithActionError(snap, context, {
          totalNumSteps,
          stepIdx
        })
        throw new Error(`Error running step: ${stepIdx} : ${err.message}`)
      }

      // Update response with step complete progress
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
    console.error('Step type is "Custom", returning error')
    throw new Error('Custom action type not currently supported')
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
        // Run normal copy if batching is disabled
        if (step.disableBatching) {
          return copyBetweenRTDBInstances(
            app1,
            app2,
            step,
            convertedInputValues
          )
        }
        // Batch copy by default
        return batchCopyBetweenRTDBInstances(
          app1,
          app2,
          step,
          convertedInputValues,
          eventData
        ).catch((batchErr) => {
          // Fallback to copying without batching
          console.error('Batch copy error:', batchErr)
          console.error('Batch copy error info', { inputs, step, eventData })
          console.log('Falling back to normal copy....')
          return copyBetweenRTDBInstances(
            app1,
            app2,
            step,
            convertedInputValues
          )
        })
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
