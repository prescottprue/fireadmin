/* eslint-disable no-console */
import * as admin from 'firebase-admin'
import os from 'os'
import fs from 'fs-extra'
import mkdirp from 'mkdirp-promise'
import { invoke } from 'lodash'
const functions = require('firebase-functions')

/**
 * @name dataMigration
 * Migrate data. Multiple serviceAccountTypes supported (i.e. stored on
 * Firestore or cloud storage)
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref('/requests/migration/{pushId}')
  .onCreate(handleMigrateRequest)

async function handleMigrateRequest(event) {
  console.log('Running migration', event.data.val())
  const { serviceAccountType = 'firestore' } = event.data.val()
  switch (serviceAccountType) {
    case 'firestore':
      return migrationUsingFirestore(event)
    default:
      const errMessage = 'Invalid event type in migration request'
      console.error(errMessage)
      throw new Error(errMessage)
  }
}

const appFromFirestorePath = async (path, name) => {
  const firestore = admin.firestore()
  const serviceAccountData = await firestore.doc(path).get()
  const localPath = `serviceAccounts/${name}`
  const tempLocalFile = path.join(os.tmpdir(), localPath)
  const tempLocalDir = path.dirname(tempLocalFile)
  await mkdirp(tempLocalDir)
  await fs.writeJson(tempLocalFile, serviceAccountData.serviceAccount)
  return admin.initializeApp(
    {
      credential: admin.credential.cert(tempLocalFile),
      databaseURL: serviceAccountData.databaseURL
    },
    name
  )
}

/**
 * Data migration using Service account stored on Firestore
 * @param  {functions.Event} event [description]
 * @param  {object|undefined} event.params [description]
 * @param  {String} event.data.serviceAccountType - Type of service accounts, options
 * include 'firestore', 'storage', or 'rtdb'
 * @return {Promise}
 */
async function migrationUsingFirestore(event) {
  const eventData = event.data.val()
  const {
    serviceAccount1Path,
    serviceAccount2Path,
    dataType = 'firestore'
  } = event.data.val()
  const app1 = appFromFirestorePath(serviceAccount1Path, 'app1')
  const app2 = appFromFirestorePath(serviceAccount2Path, 'app2')
  switch (dataType) {
    case 'firestore':
      await copyBetweenFirestoreInstances(app1, app2, eventData)
      break
    case 'rtdb':
      await copyBetweenRTDBInstances(app1, app2, eventData)
      break
    default:
      throw new Error(
        'Data type not supported. Try firestore, rtdb, or storage'
      )
  }
  return updateResponseOnRTDB(event)
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
    .child(`responses/migration/${event.params.pushId}`)
    .set(response)
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
