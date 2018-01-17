import * as admin from 'firebase-admin'
import { ACTION_RUNNER_RESPONSES_PATH } from './constants'

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

export function updateRequestAsStarted(event) {
  const response = {
    status: 'started',
    startedAt: admin.database.ServerValue.TIMESTAMP
  }
  return event.data.adminRef.ref.update(response)
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
