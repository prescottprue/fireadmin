import { size, chunk, flatten, isArray } from 'lodash'
import * as admin from 'firebase-admin'
import { ACTION_RUNNER_RESPONSES_PATH } from './constants'
import { to, promiseWaterfall } from '../utils/async'

/**
 * Convert slash path to Firestore reference
 * @param  {firestore.Firestore} firestoreInstance - Instance on which to
 * create ref
 * @param  {String} slashPath - Path to convert into firestore refernce
 * @return {firestore.CollectionReference|firestore.DocumentReference}
 */
export function slashPathToFirestoreRef(firestoreInstance, slashPath) {
  let ref = firestoreInstance
  const srcPathArr = slashPath.split('/')
  srcPathArr.forEach(pathSegment => {
    if (ref.collection) {
      ref = ref.collection(pathSegment)
    } else if (ref.doc) {
      ref = ref.doc(pathSegment)
    } else {
      throw new Error(`Invalid slash path: ${slashPath}`)
    }
  })
  return ref
}

/**
 * Create data object with values for each document with keys being doc.id.
 * @param  {firebase.database.DataSnapshot} snapshot - Data for which to create
 * an ordered array.
 * @return {Object|Null} Object documents from snapshot or null
 */
export function dataArrayFromSnap(snap, onlyIds) {
  const data = []
  if (snap.data && snap.exists) {
    const docData = { id: snap.id }
    if (!onlyIds) {
      docData.data = (snap.data && snap.data()) || snap
    }
    data.push(docData)
  } else if (snap.forEach) {
    snap.forEach(doc => {
      const docData = { id: doc.id }
      if (!onlyIds) {
        docData.data = (doc.data && doc.data()) || doc
      }
      data.push(docData)
    })
  }
  return data
}

/**
 * Create data object with values for each document with keys being doc.id.
 * @param  {firebase.database.DataSnapshot} snapshot - Data for which to create
 * an ordered array.
 * @return {Object|Null} Object documents from snapshot or null
 */
export function dataByIdSnapshot(snap) {
  const data = {}
  if (snap.data && snap.exists) {
    data[snap.id] = snap.data()
  } else if (snap.forEach) {
    snap.forEach(doc => {
      data[doc.id] = doc.data() || doc
    })
  }
  return size(data) ? data : null
}

const MAX_DOCS_PER_BATCH = 500

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
    console.error(errMsg, addErr.message || addErr)
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
    collectionsSnap.forEach(collectionSnap => {
      collectionsIds.push(collectionSnap.id)
    })
  }
  return collectionsIds
}

async function writeDocBatch({ dataFromSrc, destRef, opts }) {
  const batch = destRef.firestore.batch()
  const srcChildIds = []
  // Call set to dest instance for each doc within the original data
  dataFromSrc.forEach(({ id, data }) => {
    const childRef = destRef.doc(id)
    srcChildIds.push(id)
    batch.set(childRef, data, opts)
  })
  const [writeErr, writeRes] = await to(batch.commit())
  // Handle errors in batch write
  if (writeErr) {
    console.error('Error writing batch ', writeErr.message || writeErr, {
      destId: destRef.id
    })
    throw writeErr
  }
  return writeRes
}

/**
 * Write documents to Firestore in batches. If there are more docs than
 * the max docs per batch count, multiple batches will be run in succession.
 * @param  {firestore.Firestore} firestoreInstance - Instance on which to
 * create ref
 * @param  {String} destPath - Destination path under which data should be
 * written
 * @param  {Array} docData - List of docs to be written
 * @param  {Object} opts - Options object (can contain merge)
 * @return {Promise} Resolves with results of batch commit
 */
export async function writeDocsInBatches({ dataFromSrc, destRef, opts }) {
  // Check if doc data is longer than max docs per batch
  if (dataFromSrc && dataFromSrc.length < MAX_DOCS_PER_BATCH) {
    // Less than the max number of docs in a batch
    return writeDocBatch({ dataFromSrc, destRef, opts })
  }
  // More than max number of docs per batch - run multiple batches in succession
  const promiseResult = await promiseWaterfall(
    chunk(dataFromSrc, MAX_DOCS_PER_BATCH).map((dataChunk, chunkIdx) => {
      // Return a function to fit promise waterfall pattern
      return () => {
        console.log(`Writing chunk #${chunkIdx} to ${destRef.id}`)
        return writeDocBatch({ dataFromSrc: dataChunk, destRef, opts })
      }
    })
  )
  // Flatten array of arrays (one for each chunk) into an array of results
  // and wrap in promise resolve
  return flatten(promiseResult)
}

/**
 * Get all collection names for a Firestore ref using getCollections
 * @param  {Object} ref - Firestore reference
 * @return {Promise} Resolves with an array of collection names
 */
async function getAllCollectionNames(ref) {
  const [getCollectionsErr, collections] = await to(ref.getCollections())
  // Handle errors in batch write
  if (getCollectionsErr) {
    console.error(
      'Error getting collections: ',
      getCollectionsErr.message || getCollectionsErr
    )
    throw getCollectionsErr
  }
  console.log('collections response:', collections)
  const collectionsNamesArray = dataArrayFromSnap(collections, true)
  console.log('collectionsNamesArray', collectionsNamesArray)
  return collectionsNamesArray
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
  // Get data from src reference
  const [getErr, firstSnap] = await to(srcRef.get())
  console.log('batch copy copyBetweenFirestoreInstances:', {
    srcId: srcRef.id,
    destId: destRef.id,
    copySubcollections
  })

  // Handle errors getting original data
  if (getErr) {
    console.error(
      'Error getting data from first instance: ',
      getErr.message || getErr
    )
    throw getErr
  }

  // Get data into array (regardless of single doc or collection)
  const dataFromSrc = dataArrayFromSnap(firstSnap)

  const [writeErr] = await to(
    writeDocsInBatches({ dataFromSrc, destRef, opts })
  )

  // Handle errors in batch write
  if (writeErr) {
    console.error(
      'Error writing docs in batches: ',
      writeErr.message || writeErr
    )
    throw writeErr
  }

  if (!copySubcollections) {
    console.log(
      `Successfully copied docs from Firestore collection "${srcRef.id}"`
    )
    return null
  }

  console.log(
    `Successfully copied docs from Firestore collection "${
      srcRef.id
    }" starting subcollections copy...`
  )

  // Write subcollections of all documents
  const [subcollectionWriteErr] = await to(
    Promise.all(
      dataFromSrc.map(async ({ id: childDocId }) => {
        const docSrcRef = srcRef.doc(childDocId)
        const docDestRef = destRef.doc(childDocId)

        let subcollectionNames
        if (!isArray(copySubcollections)) {
          console.log(
            `Getting subcollection names for ${srcRef.id}/${childDocId}`
          )
          subcollectionNames = await getAllCollectionNames(docSrcRef)
        } else {
          subcollectionNames = copySubcollections
        }

        if (!subcollectionNames.length) {
          console.log(`No subcollections found for ${srcRef.id}/${childDocId}`)
          return null
        }
        console.log('Document has subcollections:', {
          srcId: srcRef.id,
          destId: destRef.id,
          childDocId,
          subcollectionNames
        })

        return Promise.all(
          subcollectionNames.map(collectionName =>
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
      `Error writing subcollections for collection: ${srcRef.id}`,
      subcollectionWriteErr.message || subcollectionWriteErr
    )
    throw subcollectionWriteErr
  }

  console.log(
    `Successfully copied docs from Firestore path: ${
      srcRef.id
    } with subcollections: ${copySubcollections}`
  )

  return null
}
