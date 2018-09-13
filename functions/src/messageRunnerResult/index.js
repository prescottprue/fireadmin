import * as functions from 'firebase-functions'
import { to } from 'utils/async'
import { rtdbRef } from '../utils/rtdb'
import { get } from 'lodash'

const actionRunnerPath = 'actionRunner'

/**
 * @param  {functions.Event} event - Function event
 * @param {functions.Context} context - Functions context
 * @return {Promise}
 */
async function messageRunnerResultEvent(change, context) {
  const {
    params: { actionRunRequestKey }
  } = context
  const { after } = change
  const status = after.val()

  // Skip cleanup if status is not "error" or "success"
  if (status !== 'error' && status !== 'success') {
    console.log(
      `Status updated to "${status}", which does not require cleanup. Exiting...`
    )
    return null
  }

  console.log(
    `Status updated to "${status}", which means a message should be sent...`
  )

  // Get test run meta data (event is on the level of status)
  const testRunMetaRef = after.ref.parent
  const [getDataErr, jobRunDataSnap] = await to(testRunMetaRef.once('value'))

  // Handle errors getting job run data
  if (getDataErr) {
    console.error(
      `Error getting runner response data: ${getDataErr.message || ''}`,
      getDataErr
    )
    throw getDataErr
  }

  const [getRunnerDataErr, callRunnerRequestSnap] = await to(
    rtdbRef(`requests/${actionRunnerPath}/${actionRunRequestKey}`).once('value')
  )

  if (getRunnerDataErr) {
    console.error(
      `Error getting runner request data: ${getRunnerDataErr.message || ''}`,
      getRunnerDataErr
    )
    throw getRunnerDataErr
  }

  const projectCreator = get(jobRunDataSnap.val(), 'createdBy')

  const callRunnerRequestCreator = get(callRunnerRequestSnap.val(), 'createdBy')
  const createdBy = projectCreator || callRunnerRequestCreator

  // Handle createdBy not being set on request or response
  if (!createdBy) {
    const missingCreatedByErr = `createdBy is not set on request for "${actionRunRequestKey}"`
    console.error(missingCreatedByErr)
    throw new Error(missingCreatedByErr)
  }

  // Request sendFcm Cloud Function to send message to creator of run request
  const [writeErr] = await to(
    rtdbRef('requests/sendFcm').push({
      userId: createdBy,
      message:
        status === 'success'
          ? `Action Run completed successfully`
          : `Error With Action Run`
    })
  )

  // Handle errors requesting writing request to RTDB for sendFcm
  if (writeErr) {
    console.error(
      `Error requesting sendFcm: ${writeErr.message || ''}`,
      writeErr
    )
    throw writeErr
  }

  return null
}

/**
 * @name messageRunnerResult
 * Cloud Function triggered by Real Time Database Write Event
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref(`/responses/${actionRunnerPath}/{actionRunRequestKey}/status`)
  .onWrite(messageRunnerResultEvent)
