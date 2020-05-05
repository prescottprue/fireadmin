import * as admin from 'firebase-admin'
import { get } from 'lodash'
import { runStepsFromEvent, runBackupsFromEvent } from './runSteps'
import { to } from '../utils/async'
import {
  updateResponseOnRTDB,
  updateRequestAsStarted,
  writeProjectEvent
} from './utils'
import { rtdbRef } from '../utils/rtdb'

/**
 * Run action based on action template. Multiple Service Account Types
 * supported (i.e. stored on Firestore or cloud storage)
 * @param {functions.database.DataSnapshot} snap - Data snapshot from cloud function
 * @param {functions.EventContext} context - The context in which an event occurred
 * @param {object} context.params - Parameters from event
 */
export default async function runAction(snap, context) {
  const eventData = snap.val() || {}
  console.log('Action run request received. Sending start event...')

  // Running an action not supported without projectId
  if (!eventData.projectId) {
    const missingProjectErr = new Error('projectId parameter is required')
    await updateResponseOnRTDB(snap, context, missingProjectErr)
    throw missingProjectErr
  }

  await Promise.all([
    // Mark original request object as started
    updateRequestAsStarted(snap, context),
    // Write an event to project's "events" subcollection
    writeProjectEvent(eventData.projectId, {
      eventType: 'startActionRun',
      eventData
    })
  ])

  console.log('Start event sent successfully. Starting action run...')

  // Handle backups if they exist within the template
  if (get(eventData, 'template.backups')) {
    console.log('Backups exist within template, running backups...')
    const [backupsErr] = await to(runBackupsFromEvent(snap, context))

    // Handle errors within backups
    if (backupsErr) {
      console.error('Error with backups:', backupsErr.message || backupsErr)
      const errorEvent = {
        eventType: 'actionRunError',
        errorStage: 'backups',
        eventData: {
          error: backupsErr.message
        }
      }
      await Promise.all([
        // Mark original request object with error
        updateResponseOnRTDB(snap, context, backupsErr),
        // Write an error event to project's events subcollection
        writeProjectEvent(eventData.projectId, errorEvent)
      ])
      throw backupsErr
    }
    console.log('Backups completed successfully, continuing...')
  } else {
    console.log('No backups exist, continuing...')
  }

  console.log('Starting steps run...')

  // Run steps
  const [err] = await to(runStepsFromEvent(snap, context))

  // Handle errors within steps
  if (err) {
    console.error('Error with action run:', err.message || err)
    const errorEvent = {
      eventType: 'actionRunError',
      eventData: {
        error: err.message
      }
    }
    await Promise.all([
      // Mark original request object with error
      updateResponseOnRTDB(snap, context, err),
      // Write an error event to project's events subcollection
      writeProjectEvent(eventData.projectId, errorEvent),
      // Request sendFcm Cloud Function to send error message to creator of run request
      sendFcmMessageToUser({
        userId: eventData.createdBy,
        message: 'Error with Action Run'
      })
    ])
    throw err
  }

  console.log(
    'Action completed successfully, writing event data and notifying user...'
  )

  await Promise.all([
    // Write event to project "events" subcollection indicating action run is complete
    writeProjectEvent(eventData.projectId, {
      eventType: 'finishActionRun',
      eventData
    }),
    // Request sendFcm Cloud Function to send message to creator of run request
    sendFcmMessageToUser({
      userId: eventData.createdBy,
      message: `Action Run completed successfully`
    })
  ])

  console.log('Event and message request written successfully, exiting.')

  return null
}

/**
 * Send FCM message to user
 * @param {object} params - Params object
 * @param {string} params.message - Message to send to user
 * @param {string} params.userId - UID of user to send FCM to
 * @returns {Promise} Resolves with results of pushing message to RTDB
 */
function sendFcmMessageToUser({ message, userId }) {
  return rtdbRef('requests/sendFcm').push({
    userId,
    message,
    createdAt: admin.database.ServerValue.TIMESTAMP
  })
}
