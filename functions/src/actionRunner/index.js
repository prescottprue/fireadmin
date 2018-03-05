import { invoke } from 'lodash'
import { updateResponseOnRTDB, updateRequestAsStarted } from './utils'
import { ACTION_RUNNER_REQUESTS_PATH } from './constants'
import { runStepsFromEvent } from './steps'
import { to } from '../utils/async'
import * as admin from 'firebase-admin'
const functions = require('firebase-functions')

async function writeProjectEvent(projectId, extraEventAttributes) {
  const eventObject = {
    createdByType: 'system',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    ...extraEventAttributes
  }
  const eventsRef = admin
    .firestore()
    .collection('projects')
    .doc(projectId)
    .collection('events')
  const [addErr, addRes] = await to(eventsRef.add(eventObject))
  if (addErr) {
    const errMsg = `Error adding event data to Project events for project: ${projectId}`
    console.error(errMsg)
    console.error(addErr.message || addErr)
    throw new Error(errMsg)
  }
  return addRes
}

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
  const eventData = invoke(event.data, 'val') || {}
  console.log('Action run request recieved', eventData)
  if (!eventData.projectId) {
    throw new Error('projectId parameter is required')
  }
  const startEvent = {
    eventType: 'startActionRun',
    eventData
  }

  await updateRequestAsStarted(event)
  await writeProjectEvent(eventData.projectId, startEvent)
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
