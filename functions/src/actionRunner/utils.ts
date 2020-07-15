import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import fetch from 'node-fetch'
import { omit, uniqueId } from 'lodash'
import { PROJECTS_COLLECTION } from '../constants/firebasePaths'
import {
  authClientFromServiceAccount,
  serviceAccountFromFirestorePath
} from '../utils/serviceAccounts'
import { ACTION_RUNNER_EVENT_PATH } from './constants'
import { to } from '../utils/async'
import {
  writeDocsInBatches,
  isDocPath
} from '../utils/firestore'

const ACTION_RUNNER_RESPONSES_PATH = `responses/${ACTION_RUNNER_EVENT_PATH}`

interface ErrorInfo {
  message?: string
  status?: string
}


interface DataObject {
  id: string
  data: any
}

/**
 * Create data object with values for each document with keys being doc.id.
 * @param snap - Data for which to create
 * an ordered array.
 * @returns Object documents from snapshot or null
 */
function dataArrayFromSnap(
  snap: admin.firestore.DocumentSnapshot | admin.firestore.QuerySnapshot | any
): DataObject[] {
  const data: DataObject[] = []
  if (snap.data && snap.exists) {
    data.push({ id: snap.id, data: snap.data() })
  } else if (snap.forEach) {
    snap.forEach((doc) => {
      data.push({ id: doc.id, data: doc.data() || doc })
    })
  }
  return data
}


/**
 * Write response object with status "success" or "error". If
 * status is "error", message is also included.
 * @param snap - Functions snapshot object
 * @param context - Functions context object
 * @param error - Error object
 * @returns Resolves with results of database write promise
 */
export function updateResponseOnRTDB(snap, context, error?: ErrorInfo) {
  const response: any = {
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
 * @param snap - Functions snapshot object
 * @returns Resolves with results of database update promise
 */
export async function updateRequestAsStarted(snap: admin.database.DataSnapshot): Promise<any> {
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
 * @param eventData - Functions snapshot object
 * @param eventData.projectId - Functions snapshot object
 * @returns Resolves with results of firstore add promise
 */
export async function emitProjectEvent(eventData): Promise<any> {
  const { projectId } = eventData
  const [writeErr, writeRes] = await to(
    admin
      .firestore()
      .collection(`${PROJECTS_COLLECTION}/${projectId}/events`)
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
 * @param snap - Snapshot
 * @param context - event context
 * @param actionInfo - Info about action
 * @param actionInfo.stepIdx - Index of current step
 * @param actionInfo.totalNumSteps - Total number of steps in action
 * @returns Resolves with results of database write promise
 */
export function updateResponseWithProgress(
  snap: admin.firestore.DocumentSnapshot,
  context: functions.EventContext,
  { stepIdx, totalNumSteps }: { stepIdx: number, totalNumSteps: number }
): Promise<any> {
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
 * @param  snap - Functions snapshot object
 * @param  context - Functions context object
 * @returns Resolves with results of database write promise
 */
export function updateResponseWithError(snap, context): Promise<any> {
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
 * @param snap - Functions snapshot object
 * @param context - Context of event
 * @param actionInfo - Info about action
 * @param actionInfo.stepIdx - Index of current step
 * @param actionInfo.totalNumSteps - Total number of steps in action
 * @returns {Promise} Resolves with results of database write promise
 */
export function updateResponseWithActionError(
  snap,
  context,
  { stepIdx, totalNumSteps }
): Promise<any> {
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
 * @param projectId - id of project in which event should be placed
 * @param extraEventAttributes - Data to attach to the event
 * @returns Resolves with results of pushing event object
 */
export async function writeProjectEvent(projectId: string, extraEventAttributes = {}) {
  const eventObject = {
    createdByType: 'system',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    ...omit(extraEventAttributes, ['updatedAt', '_highlightResult'])
  }
  const eventsRef = admin
    .firestore()
    .collection(`${PROJECTS_COLLECTION}/${projectId}/events`)

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
 * @param collectionsSnap - Collection snap object with forEach
 * @returns List of collection snapshot ids
 */
function collectionsSnapToArray(collectionsSnap): string[] {
  const collectionsIds: string[] = []
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
 * @param subcollectionSetting - Current subcollection setting (list of names)
 * @param ref - Firestore reference
 * @returns Resolves with an array of collection names
 */
async function getSubcollectionNames(subcollectionSetting: string[] | boolean, ref: admin.firestore.DocumentReference): Promise<any> {
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

interface FirestoreBatchCopyOptions {
  copySubcollections?: boolean
  merge?: boolean
}

/**
 * Write document updates in a batch process.
 * @param params - Params object
 * @param params.srcRef - Instance on which to create ref
 * @param params.destRef - Destination path under which data should be written
 * @param params.opts - Options object (can contain merge)
 * @returns Resolves with results of batch commit
 */
export async function batchCopyBetweenFirestoreRefs({
  srcRef,
  destRef,
  opts
}: {
  srcRef: FirebaseFirestore.DocumentReference | FirebaseFirestore.CollectionReference | any
  destRef: FirebaseFirestore.DocumentReference | FirebaseFirestore.CollectionReference | any
  opts: FirestoreBatchCopyOptions
}): Promise<any> {
  const { copySubcollections } = opts || {}
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

/**
 * Request google APIs with auth attached
 * @param opts - Google APIs method to call
 * @param opts.projectId - Id of fireadmin project
 * @param opts.environmentId - Id of fireadmin environment
 * @param opts.databaseName - Name of database on which to run (defaults to project base DB)
 * @param rtdbPath - Path of RTDB data to get
 * @returns Resolves with results of RTDB shallow get
 */
export async function shallowRtdbGet(opts, rtdbPath: string | undefined): Promise<any> {
  const { projectId, environmentId, databaseName } = opts
  if (!environmentId) {
    throw new Error(
      'environmentId is required for action to authenticate through serviceAccount'
    )
  }

  // Make unique app name (prevents issue of multiple apps initialized with same name)
  const appName = `${environmentId}-${uniqueId()}`
  // Get Service account data from resource (i.e Storage, Firestore, etc)
  const [saErr, serviceAccount] = await to(
    serviceAccountFromFirestorePath(
      `${PROJECTS_COLLECTION}/${projectId}/environments/${environmentId}`,
      appName,
      { returnData: true }
    )
  )

  if (saErr) {
    console.error(
      `Error getting service account: ${saErr.message || ''}`,
      saErr
    )
    throw saErr
  }

  const client: any = await authClientFromServiceAccount(serviceAccount)

  const apiUrl = `https://${
    databaseName || serviceAccount.project_id
  }.firebaseio.com/${rtdbPath || ''}.json?access_token=${
    client.credentials.access_token
  }&shallow=true`

  const [getErr, response] = await to(fetch(apiUrl))

  const responseJson = await response.json()

  if (getErr) {
    console.error(
      `Firebase REST API errored when calling path "${rtdbPath}" for environment "${projectId}/${environmentId}" : ${
        getErr.statusCode
      } \n ${getErr.error ? getErr.error.message : ''}`
    )
    throw getErr.error || getErr
  }

  if (typeof responseJson === 'string' || responseJson instanceof String) {
    return JSON.parse(response as string)
  }

  return responseJson
}

