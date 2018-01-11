import * as admin from 'firebase-admin'
import path from 'path'
import fs from 'fs'
import os from 'os'
import { MIGRATION_RESPONSES_PATH } from './constants'

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
    .child(`${MIGRATION_RESPONSES_PATH}/${event.params.pushId}`)
    .set(response)
}

export function updateRequestAsStarted(event) {
  const response = {
    status: 'started',
    startedAt: admin.database.ServerValue.TIMESTAMP
  }
  return event.data.adminRef.ref.update(response)
}

export function updateResponseWithProgress(
  event,
  { currentAction, totalNumActions }
) {
  const response = {
    status: 'running',
    stepCompleteStatus: {
      [currentAction]: true
    },
    progress: currentAction / totalNumActions,
    updatedAt: admin.database.ServerValue.TIMESTAMP
  }
  return event.data.adminRef.ref.root
    .child(`${MIGRATION_RESPONSES_PATH}/${event.params.pushId}`)
    .update(response)
}

export function updateResponseWithError(event) {
  const response = {
    status: 'error',
    updatedAt: admin.database.ServerValue.TIMESTAMP
  }
  return event.data.adminRef.ref.root
    .child(`${MIGRATION_RESPONSES_PATH}/${event.params.pushId}`)
    .update(response)
}

export function updateResponseWithActionError(
  event,
  { currentAction, totalNumActions }
) {
  const response = {
    status: 'error',
    stepCompleteStatus: {
      [currentAction]: false
    },
    stepErrorStatus: {
      [currentAction]: true
    },
    progress: currentAction / totalNumActions,
    updatedAt: admin.database.ServerValue.TIMESTAMP
  }
  return event.data.adminRef.ref.root
    .child(`${MIGRATION_RESPONSES_PATH}/${event.params.pushId}`)
    .update(response)
}

export function cleanup() {
  cleanupServiceAccount('app1')
  cleanupServiceAccount('app2')
}

function cleanupServiceAccount(appName) {
  const localPath = `serviceAccounts/${appName}.json`
  const tempLocalPath = path.join(os.tmpdir(), localPath)
  fs.unlinkSync(tempLocalPath)
}

// function updateResponseOnFirestore(event) {
//   return admin.firestore()
//     .child(`responses/migration/${event.params.pushId}`)
//     .set({
//       completed: true,
//       completedAt: admin.database.ServerValue.TIMESTAMP
//     })
// }

// const actionBetweenTwoAppInstances = () => () => {
//   const app1 = appFromFirestorePath(serviceAccount1Path, 'app1')
//   const app2 = appFromFirestorePath(serviceAccount2Path, 'app2')
//   return action(app1, app2)
// }
