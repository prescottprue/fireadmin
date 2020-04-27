import { omit } from 'lodash'
import * as admin from 'firebase-admin'
import { ACTION_RUNNER_RESPONSES_PATH } from './constants'
import { to } from '../utils/async'
import {
  writeDocsInBatches,
  dataArrayFromSnap,
  isDocPath
} from '../utils/firestore'

/**
 * Write response object with status "success" or "error". If
 * status is "error", message is also included.
 * @param  {Object} snap - Functions snapshot object
 * @param  {Object} context - Functions context object
 * @return {Promise} Resolves with results of database write promise
 */
export function updateResponseOnRTDB(snap, context, error) {
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
  return admin
    .database()
    .ref(`${ACTION_RUNNER_RESPONSES_PATH}/${context.params.pushId}`)
    .set(response)
}

/**
 * Update request with status "started"
 * @param  {Object} snap - Functions snapshot object
 * @return {Promise} Resolves with results of database update promise
 */
export async function updateRequestAsStarted(snap) {
  const response = {
    status: 'started',
    startedAt: admin.database.ServerValue.TIMESTAMP
  }
  const [dbUpdateError, updateRes] = await to(snap.ref.update(response))
  if (dbUpdateError) {
    console.error(
      'Error updating request as started within RTDB:',
      dbUpdateError.message || dbUpdateError
    )
    throw dbUpdateError
  }
  return updateRes
}

/**
 * Write event to project events subcollection
 * @param  {Object} eventData - Functions snapshot object
 * @param  {String} eventData.projectId - Functions snapshot object
 * @return {Promise} Resolves with results of firstore add promise
 */
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

/**
 * Update response object within Real Time Database with progress information
 * about an action.
 * @param  {Object} event - Functions event object
 * @param  {Object} actionInfo - Info about action
 * @param  {Number} actionInfo.stepIdx - Index of current step
 * @param  {Number} acitonInfo.totalNumSteps - Total number of steps in action
 * @return {Promise} Resolves with results of database write promise
 */
export function updateResponseWithProgress(
  snap,
  context,
  { stepIdx, totalNumSteps }
) {
  const response = {
    status: 'running',
    stepStatus: {
      complete: {
        [stepIdx]: true
      }
    },
    progress: stepIdx / totalNumSteps,
    updatedAt: admin.database.ServerValue.TIMESTAMP
  }
  return admin
    .database()
    .ref(`${ACTION_RUNNER_RESPONSES_PATH}/${context.params.pushId}`)
    .update(response)
}

/**
 * Write error to response object within Database
 * @param  {Object} snap - Functions snapshot object
 * @param  {Object} context - Functions context object
 * @return {Promise} Resolves with results of database write promise
 */
export function updateResponseWithError(snap, context) {
  const response = {
    status: 'error',
    complete: true,
    updatedAt: admin.database.ServerValue.TIMESTAMP
  }
  return admin
    .database()
    .ref(`${ACTION_RUNNER_RESPONSES_PATH}/${context.params.pushId}`)
    .update(response)
}

/**
 * Update response object within Real Time Database with error information about
 * an action
 * @param  {Object} snap - Functions snapshot object
 * @param  {Object} actionInfo - Info about action
 * @param  {Number} actionInfo.stepIdx - Index of current step
 * @param  {Number} acitonInfo.totalNumSteps - Total number of steps in action
 * @return {Promise} Resolves with results of database write promise
 */
export function updateResponseWithActionError(
  snap,
  context,
  { stepIdx, totalNumSteps }
) {
  const response = {
    status: 'error',
    stepCompleteStatus: {
      complete: {
        [stepIdx]: false
      },
      error: {
        [stepIdx]: true
      }
    },
    progress: stepIdx / totalNumSteps,
    updatedAt: admin.database.ServerValue.TIMESTAMP
  }
  return admin
    .database()
    .ref(`${ACTION_RUNNER_RESPONSES_PATH}/${context.params.pushId}`)
    .update(response)
}

/**
 * Write an event to a project's "events" subcollection
 * @param  {String} projectId - id of project in which event should be placed
 * @param  {Object} extraEventAttributes - Data to attach to the event
 * @return {Promise} Resolves with results of pushing event object
 */
export async function writeProjectEvent(projectId, extraEventAttributes = {}) {
  const eventObject = {
    createdByType: 'system',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    ...omit(extraEventAttributes, ['updatedAt', '_highlightResult'])
  }
  const eventsRef = admin
    .firestore()
    .collection('projects')
    .doc(projectId)
    .collection('events')

  const [addErr, addRes] = await to(eventsRef.add(eventObject))

  if (addErr) {
    const errMsg = `Error adding event data to Project events for project: ${projectId}`
    console.error(errMsg, addErr)
    throw new Error(errMsg)
  }

  return addRes
}

/**
 * Convert a collection snapshot into an array (uses forEach).
 * @param  {Object} collectionsSnap - Collection snap object with forEach
 * @return {Array} List of collection snapshot ids
 */
export function collectionsSnapToArray(collectionsSnap) {
  const collectionsIds = []
  if (collectionsSnap.forEach) {
    collectionsSnap.forEach((collectionSnap) => {
      collectionsIds.push(collectionSnap.id)
    })
  }
  return collectionsIds
}

/**
 * Get collection names from provided settings falling back to getting all
 * collection names for the provided Firestore ref using getCollections.
 * @param  {Array|Boolean} subcollectionSetting [description]
 * @param  {Object} ref - Firestore reference
 * @return {Promise} Resolves with an array of collection names
 */
async function getSubcollectionNames(subcollectionSetting, ref) {
  // Return if the provided setting is an array (assuming it is an array of names)
  if (Array.isArray(subcollectionSetting)) {
    return subcollectionSetting
  }
  // Throw an error is listCollections method does not exist
  // In place since getCollections was no longer a method which threw an unclear error
  if (typeof ref.listCollections !== 'function') {
    console.error('Document ref does not have listCollections method', {
      subcollectionSetting,
      ref,
      path: ref.path,
      type: typeof ref
    })
    throw new Error('Document ref does not have listCollections method')
  }
  // Get collection refs
  const [getCollectionsErr, collections] = await to(ref.listCollections())
  // Handle errors in batch write
  if (getCollectionsErr) {
    console.error(
      'Error getting collections: ',
      getCollectionsErr.message || getCollectionsErr
    )
    throw getCollectionsErr
  }
  return collectionsSnapToArray(collections)
}

/**
 * Write document updates in a batch process.
 * @param  {firestore.Firestore} firestoreInstance - Instance on which to
 * create ref
 * @param  {String} destPath - Destination path under which data should be
 * written
 * @param  {Array} docData - List of docs to be written
 * @param  {Object} opts - Options object (can contain merge)
 * @return {Promise} Resolves with results of batch commit
 */
export async function batchCopyBetweenFirestoreRefs({
  srcRef,
  destRef,
  opts = {}
}) {
  const { copySubcollections } = opts
  // TODO: Switch to querying in batches limited to 500 so reads/writes match
  // Get data from src reference
  const [getErr, firstSnap] = await to(srcRef.get())

  // Handle errors getting original data
  if (getErr) {
    console.error(
      'Error getting data from first instance: ',
      getErr.message || getErr
    )
    throw getErr
  }

  // Handle single document copy
  if (isDocPath(destRef.path)) {
    const docData = firstSnap.data()

    // Handle source document data not existing
    if (!docData) {
      throw new Error(`Document at path ${srcRef.path} not found`)
    }

    const [docWriteErr] = await to(destRef.set(docData, { merge: true }))

    // Handle errors in single document write
    if (docWriteErr) {
      console.error(
        `Error copying doc from "${srcRef.path}" to "${destRef.path}": `,
        docWriteErr.message || docWriteErr
      )
      throw docWriteErr
    }

    // Set with merge to do updating while also handling docs not existing
    return destRef.set(docData, { merge: true })
  }

  // Get data into array (regardless of single doc or collection)
  const dataFromSrc = dataArrayFromSnap(firstSnap)

  // Write docs (batching if necessary)
  const [writeErr] = await to(
    writeDocsInBatches(destRef.firestore, destRef.path, dataFromSrc, opts)
  )

  // Handle errors in batch write
  if (writeErr) {
    console.error(
      `Error batch copying docs from "${srcRef.id}" to "${destRef.id}": `,
      writeErr.message || writeErr
    )
    throw writeErr
  }

  // Exit if not copying subcollections
  if (!copySubcollections) {
    console.log(
      `Successfully copied docs from Firestore collection "${srcRef.id}"`
    )
    return null
  }

  console.log(
    `Successfully copied docs from Firestore collection "${srcRef.id}" starting subcollections copy...`
  )

  // Write subcollections of all documents
  const [subcollectionWriteErr] = await to(
    Promise.all(
      dataFromSrc.map(async ({ id: childDocId }) => {
        const docSrcRef = srcRef.doc(childDocId)
        const docDestRef = destRef.doc(childDocId)
        // Get subcollection names from settings falling back to all subcollections
        const subcollectionNames = await getSubcollectionNames(
          copySubcollections,
          docSrcRef
        )

        // Exit if the document does not have any subcollections
        if (!subcollectionNames.length) {
          return null
        }
        // Copy subcollections in batches of 500 docs at a time
        return Promise.all(
          subcollectionNames.map((collectionName) =>
            batchCopyBetweenFirestoreRefs({
              srcRef: docSrcRef.collection(collectionName),
              destRef: docDestRef.collection(collectionName),
              opts
            })
          )
        )
      })
    )
  )

  if (subcollectionWriteErr) {
    console.error(
      `Error writing subcollections for collection "${srcRef.id}": ${
        subcollectionWriteErr.message || ''
      }`,
      subcollectionWriteErr
    )
    throw subcollectionWriteErr
  }

  console.log(
    `Successfully copied docs from Firestore path: ${srcRef.id} with subcollections: ${copySubcollections}`
  )

  return null
}
