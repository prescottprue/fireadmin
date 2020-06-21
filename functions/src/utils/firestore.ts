import * as admin from 'firebase-admin'
import { size, chunk, flatten } from 'lodash'
import { to, promiseWaterfall } from '../utils/async'

/**
 * Check if a slash path is a doc path
 * @param slashPath - Path to convert into firestore reference
 * @returns Whether or not path is a doc path
 * @example Basic
 * isDocPath('projects') // => false
 * isDocPath('projects/asdf') // => true
 */
export function isDocPath(slashPath: string): boolean {
  return (slashPath.split('/').length - 1) % 2 === 1
}

/**
 * Convert slash path to Firestore reference
 * @param {firestore.Firestore} firestoreInstance - Instance on which to
 * create ref
 * @param slashPath - Path to convert into firestore reference
 * @returns {firestore.CollectionReference|firestore.DocumentReference} Reference
 * @example Subcollection
 * const subCollectRef = slashPathToFirestoreRef(admin.firestore(), 'projects/some/events')
 * subCollectRef.add({}) // add some doc to the subcollection
 * // => Subcollection reference
 */
export function slashPathToFirestoreRef(firestoreInstance, slashPath: string) {
  let ref = firestoreInstance
  const srcPathArr = slashPath.split('/')
  srcPathArr.forEach((pathSegment) => {
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
export function dataArrayFromSnap(
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
 * Create data object with values for each document with keys being doc.id.
 * @param {firebase.database.DataSnapshot} snap - Data for which to create
 * an ordered array.
 * @returns {object|null} Object documents from snapshot or null
 */
export function dataByIdSnapshot(snap) {
  const data = {}
  if (snap.data && snap.exists) {
    data[snap.id] = snap.data()
  } else if (snap.forEach) {
    snap.forEach((doc) => {
      data[doc.id] = doc.data() || doc
    })
  }
  return size(data) ? data : null
}

interface BatchWriteOptions {
  merge?: boolean
}

/**
 * Write document updates in a batch process.
 * @param {firestore.Firestore} firestoreInstance - Instance on which to
 * create ref
 * @param destPath - Destination path under which data should be
 * written
 * @param docData - List of docs to be written
 * @param opts - Options object (can contain merge)
 * @returns Resolves with results of batch commit
 */
export async function batchWriteDocs(
  firestoreInstance,
  destPath: string,
  docData: any[],
  opts?: BatchWriteOptions
): Promise<any> {
  const batch = firestoreInstance.batch()
  // Call set to dest for each doc within the original data
  docData.forEach(({ id, data }) => {
    const childRef = slashPathToFirestoreRef(firestoreInstance, destPath).doc(
      id
    )
    batch.set(childRef, data, opts)
  })
  const [writeErr, writeRes] = await to(batch.commit())
  // Handle errors in batch write
  if (writeErr) {
    console.error(
      'Error copying between Firestore instances: ',
      writeErr.message || writeErr
    )
    throw writeErr
  }
  console.log(`Successfully copied docs to Firestore path: ${destPath}`)
  return writeRes
}

const MAX_DOCS_PER_BATCH = 500

/**
 * Write documents to Firestore in batches. If there are more docs than
 * the max docs per batch count, multiple batches will be run in succession.
 * @param {firestore.Firestore} firestoreInstance - Instance on which to
 * create ref
 * @param destPath - Destination path under which data should be written
 * @param docData - List of docs to be written
 * @param opts - Options object (can contain merge)
 * @returns Resolves with results of batch commit
 */
export async function writeDocsInBatches(
  firestoreInstance,
  destPath: string,
  docData: any[],
  opts?: BatchWriteOptions
): Promise<any[]> {
  // Check if doc data is longer than max docs per batch
  if (docData?.length < MAX_DOCS_PER_BATCH) {
    console.log(
      `Updating all in once back since there are ${docData.length} updates and the max batch size is ${MAX_DOCS_PER_BATCH}`
    )

    // Less than the max number of docs in a batch
    return batchWriteDocs(firestoreInstance, destPath, docData, opts)
  }
  const docChunks = chunk(docData, MAX_DOCS_PER_BATCH)

  // More than max number of docs per batch - run multiple batches in succession
  const promiseResult = await promiseWaterfall(
    docChunks.map((dataChunk, chunkIdx) => {
      return () => {
        console.log(
          `Writing chunk #${chunkIdx} of ${docChunks.length} for path: ${destPath}`
        )
        return batchWriteDocs(firestoreInstance, destPath, dataChunk, opts)
      }
    })
  )

  // Flatten array of arrays (one for each chunk) into an array of results
  // and wrap in promise resolve
  return flatten(promiseResult)
}
