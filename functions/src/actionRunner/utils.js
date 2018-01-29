import * as admin from 'firebase-admin'
import { ACTION_RUNNER_RESPONSES_PATH } from './constants'
import { to } from '../utils/async'

export function updateResponseOnRTDB(event, error) {
  const response = {
    completed: true,
    completedAt: admin.database.ServerValue.TIMESTAMP
  }
  if (error) {
    response.error = error.message || error
    response.status = 'error'
  } else {
    response.status = 'success'
  }
  return event.data.adminRef.ref.root
    .child(`${ACTION_RUNNER_RESPONSES_PATH}/${event.params.pushId}`)
    .set(response)
}

export async function updateRequestAsStarted(event) {
  const response = {
    status: 'started',
    startedAt: admin.database.ServerValue.TIMESTAMP
  }
  const [dbUpdateError, updateRes] = await to(
    event.data.adminRef.ref.update(response)
  )
  if (dbUpdateError) {
    console.error(
      'Error updating request as started within RTDB:',
      dbUpdateError.message || dbUpdateError
    )
    throw dbUpdateError
  }
  return updateRes
}

export async function emitProjectEvent(eventData) {
  const { projectId } = eventData
  const [writeErr, writeRes] = await to(
    admin
      .firestore()
      .doc(`projects/${projectId}/events`)
      .add({
        ...eventData,
        createdBy: 'system',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      })
  )
  if (writeErr) {
    console.error(
      'Error writing event to project',
      writeErr.message || writeErr
    )
    throw writeErr
  }
  return writeRes
}

export function updateResponseWithProgress(event, { stepIdx, totalNumSteps }) {
  const response = {
    status: 'running',
    stepCompleteStatus: {
      [stepIdx]: true
    },
    progress: stepIdx / totalNumSteps,
    updatedAt: admin.database.ServerValue.TIMESTAMP
  }
  return event.data.adminRef.ref.root
    .child(`${ACTION_RUNNER_RESPONSES_PATH}/${event.params.pushId}`)
    .update(response)
}

export function updateResponseWithError(event) {
  const response = {
    status: 'error',
    updatedAt: admin.database.ServerValue.TIMESTAMP
  }
  return event.data.adminRef.ref.root
    .child(`${ACTION_RUNNER_RESPONSES_PATH}/${event.params.pushId}`)
    .update(response)
}

export function updateResponseWithActionError(
  event,
  { stepIdx, totalNumSteps }
) {
  const response = {
    status: 'error',
    stepCompleteStatus: {
      [stepIdx]: false
    },
    stepErrorStatus: {
      [stepIdx]: true
    },
    progress: stepIdx / totalNumSteps,
    updatedAt: admin.database.ServerValue.TIMESTAMP
  }
  return event.data.adminRef.ref.root
    .child(`${ACTION_RUNNER_RESPONSES_PATH}/${event.params.pushId}`)
    .update(response)
}
