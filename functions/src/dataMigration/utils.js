import * as admin from 'firebase-admin'
import path from 'path'
import fs from 'fs'
import os from 'os'
import { invoke } from 'lodash'
import { MIGRATION_RESPONSES_PATH } from './constants'

/**
 * Data migration using Service account stored on Firestore
 * @param  {functions.Event} event [description]
 * @param  {object|undefined} event.params [description]
 * @param  {String} event.data.serviceAccountType - Type of service accounts, options
 * include 'firestore', 'storage', or 'rtdb'
 * @return {Promise}
 */
export async function runMigrationWithApps(app1, app2, event) {
  const { dataType = 'firestore' } = event.data.val()
  switch (dataType) {
    case 'firestore':
      await copyBetweenFirestoreInstances(app1, app2, event)
      break
    case 'rtdb':
      await copyBetweenRTDBInstances(app1, app2, event)
      break
    default:
      throw new Error(
        'Data type not supported. Try firestore, rtdb, or storage'
      )
  }
  console.log('Migration successful, cleaning up and updating Real Time DB')
  cleanup()
  return updateResponseOnRTDB(event)
}

function updateResponseOnRTDB(event, error) {
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

async function copyBetweenFirestoreInstances(app1, app2, eventData) {
  console.log('starting copyBetweenFirestoreInstances', eventData)
  const firestore1 = app1.firestore()
  const firestore2 = app2.firestore()
  const { copyPath } = eventData
  // TODO: Use runTransaction
  try {
    const dataFromFirst = await firestore1.doc(copyPath).get()
    await firestore2.doc(copyPath).update(dataFromFirst)
    console.log('copy between firestore instances was successful')
  } catch (err) {
    console.log('error copying between firestore instances')
  }
}

async function copyBetweenRTDBInstances(app1, app2, eventData) {
  const firstRTDB = app1.database()
  const secondRTDB = app2.database()
  const { copyPath } = eventData
  try {
    const dataSnapFromFirst = await firstRTDB.ref(copyPath).once('value')
    const dataFromFirst = invoke(dataSnapFromFirst, 'val')
    if (!dataFromFirst) {
      const errorMessage = 'Path does not exist in First source database'
      console.error(errorMessage)
      throw new Error(errorMessage)
    }
    await secondRTDB.ref(copyPath).update(dataFromFirst)
    console.log('copy between database instances was successful')
  } catch (err) {
    console.log('error copying between firestore instances')
  }
}

export function cleanup() {
  cleanupServiceAccount('app1')
  cleanupServiceAccount('app2')
}

function cleanupServiceAccount(appName) {
  const localPath = `serviceAccounts/${name}.json`
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
