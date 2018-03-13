import * as functions from 'firebase-functions'
import {
  updateResponseOnRTDB,
  updateRequestAsStarted,
  writeProjectEvent
} from './utils'
import { ACTION_RUNNER_REQUESTS_PATH } from './constants'
import { runStepsFromEvent } from './stepsRunner'
import { to } from '../utils/async'

/**
 * @name actionRunner
 * Run action based on action template. Multiple Service Account Types
 * supported (i.e. stored on Firestore or cloud storage)
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref(`${ACTION_RUNNER_REQUESTS_PATH}/{pushId}`)
  .onCreate(runAction)

async function runAction(event) {
  const eventData = event.data && event.data.val ? event.data.val() : {}
  console.log('Action run request recieved', eventData)

  // Running an action not supported without projectId
  if (!eventData.projectId) {
    throw new Error('projectId parameter is required')
  }

  const startEvent = {
    eventType: 'startActionRun',
    eventData
  }
  await updateRequestAsStarted(event)
  await writeProjectEvent(eventData.projectId, startEvent)
  // console.log('Start event sent successfully. Checking for backups...')
  // const [err, result] = await to(runStepsFromEvent(event))

  console.log('Start event sent successfully. Starting run of steps...')
  const [err, result] = await to(runStepsFromEvent(event))
  if (err) {
    console.error('Error with action run:', err.message || err)
    await updateResponseOnRTDB(event, err)
    const errorEvent = {
      eventType: 'actionRunError',
      eventData: {
        error: err.message
      }
    }
    await writeProjectEvent(eventData.projectId, errorEvent)
    throw err
  }

  console.log('Action completed writing event to project...')

  // Write event to project indicating action run is complete
  const finishedEvent = { eventType: 'finishActionRun', eventData }
  await writeProjectEvent(eventData.projectId, finishedEvent)

  console.log('Action completed successfully!')
  return result
}
