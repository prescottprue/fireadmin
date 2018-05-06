import { get } from 'lodash'
import { runStepsFromEvent, runBackupsFromEvent } from './runSteps'
import { to } from '../utils/async'
import {
  updateResponseOnRTDB,
  updateRequestAsStarted,
  writeProjectEvent
} from './utils'

/**
 * Run action based on action template. Multiple Service Account Types
 * supported (i.e. stored on Firestore or cloud storage)
 */
export default async function runAction(snap, context) {
  const eventData = snap.val() || {}
  console.log('Action run request recieved. Sending start event...')

  // Running an action not supported without projectId
  if (!eventData.projectId) {
    throw new Error('projectId parameter is required')
  }

  // Send start event
  const startEvent = { eventType: 'startActionRun', eventData }
  await Promise.all([
    // Mark original request object as started
    updateRequestAsStarted(snap, context),
    // Write an event to project's events subcollection
    writeProjectEvent(eventData.projectId, startEvent)
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
  const [err, result] = await to(runStepsFromEvent(snap, context))

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
      writeProjectEvent(eventData.projectId, errorEvent)
    ])
    throw err
  }

  console.log('Action completed writing event to project...')

  // Write event to project indicating action run is complete
  const finishedEvent = { eventType: 'finishActionRun', eventData }
  await writeProjectEvent(eventData.projectId, finishedEvent)

  console.log('Action completed successfully!')
  return result
}
