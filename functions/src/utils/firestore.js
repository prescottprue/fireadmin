import { size, chunk, filter, isFunction, flatten } from 'lodash'
import { to, promiseWaterfall } from '../utils/async'

/**
 * Check if a slash path is a doc path
 * @param  {String} slashPath - Path to convert into firestore refernce
 * @returns {Boolean}
 * @example Basic
 * isDocPath('projects') // => false
 * isDocPath('projects/asdf') // => true
 */
export function isDocPath(slashPath) {
  return (slashPath.split('/').length - 1) % 2 === 1
}

/**
 * Convert slash path to Firestore reference
 * @param  {firestore.Firestore} firestoreInstance - Instance on which to
 * create ref
 * @param  {String} slashPath - Path to convert into firestore refernce
 * @return {firestore.CollectionReference|firestore.DocumentReference}
 * @example Subcollection
 * const subCollectRef = slashPathToFirestoreRef(admin.firestore(), 'projects/some/events')
 * subCollectRef.add({}) // add some doc to the subcollection
 * // => Subcollection reference
 */
export function slashPathToFirestoreRef(firestoreInstance, slashPath) {
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

/**
 * Create data object with values for each document with keys being doc.id.
 * @param  {firebase.database.DataSnapshot} snapshot - Data for which to create
 * an ordered array.
 * @return {Object|Null} Object documents from snapshot or null
 */
export function dataArrayFromSnap(snap) {
  const data = []
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
 * @param  {firebase.database.DataSnapshot} snapshot - Data for which to create
 * an ordered array.
 * @return {Object|Null} Object documents from snapshot or null
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
export async function batchWriteDocs(
  firestoreInstance,
  destPath,
  docData,
  opts
) {
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
 * @param  {firestore.Firestore} firestoreInstance - Instance on which to
 * create ref
 * @param  {String} destPath - Destination path under which data should be
 * written
 * @param  {Array} docData - List of docs to be written
 * @param  {Object} opts - Options object (can contain merge)
 * @return {Promise} Resolves with results of batch commit
 */
export async function writeDocsInBatches(
  firestoreInstance,
  destPath,
  docData,
  opts
) {
  // Check if doc data is longer than max docs per batch
  if (docData && docData.length < MAX_DOCS_PER_BATCH) {
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

/**
 * Map each document in a Firestore collection.
 * @param  {Object} firestoreInstance - Instance of firestore from which to
 * get data
 * @param  {String} collectionName - Name of collection
 * @param  {Function} mapFunc - Function to map each document with
 * @param  {Object} [opts={}] - Options for mapping
 * @param  {Boolean} opts.onlyFirst - Flag to only run mapping function on first
 * item within collection (useful for testing)
 * @return {Promise} Resolves with the number of updates which where done
 * @example Basic
 * function createAddAuthorMapper({ usersById }) {
 *   return function addAuthor({ id, data }) {
 *     // Check to see if author exist
 *     if (!data.author) {
 *       // author does not exist, add it (only updates need to be returned)
 *       return { author: 'asdfasdf' }
 *     }
 *     // Document already has author, do not update
 *     return null;
 *   }
 * }
 * // Add author to each transaction in the financial_transactions collection
 * const [updateErr] = await to(
 *   mapEachItemInCollection(
 *     admin.firestore(),
 *     'financial_transactions',
 *     createAddAuthorMapper({ usersById })
 *   )
 * );
 */
export async function mapEachItemInCollection(
  firestoreInstance,
  collectionName,
  mapFunc,
  opts = {}
) {
  const queryPromise = opts.onlyFirst
    ? firestoreInstance.collection(collectionName).limit(1).get()
    : firestoreInstance.collection(collectionName).get()
  const [getErr, collectionSnap] = await to(queryPromise)
  if (getErr) {
    console.log('Error getting collection:', getErr)
    throw getErr
  }
  const collectionData = dataArrayFromSnap(collectionSnap)
  console.log(`${collectionData.length} docs loaded from ${collectionName}`)
  // Map transaction document with mapFunc
  const newCollectionData = opts.onlyFirst
    ? [
        {
          id: collectionData[0].id,
          data: isFunction(mapFunc)
            ? mapFunc({
                id: collectionData[0].id,
                data: collectionData[0].data
              })
            : collectionData[0].data
        }
      ]
    : collectionData.map(({ id, data }) => {
        const mappedItem = isFunction(mapFunc) ? mapFunc({ id, data }) : data
        return { id, data: mappedItem }
      })
  const onlyUpdates = filter(newCollectionData, 'data')
  const sizeOfUpdates = size(onlyUpdates)
  // No updates in collection
  if (!sizeOfUpdates) {
    console.log(
      `No updates to write to collection: ${collectionName}, exiting...`
    )
    return null
  }
  console.log(`Mapped data, writing back ${sizeOfUpdates}`)
  // Write new data
  const [writeErr] = await to(
    writeDocsInBatches(firestoreInstance, collectionName, onlyUpdates, {
      merge: true
    })
  )
  // Handle errors in batch write
  if (writeErr) {
    console.error(
      'Error writing updated data back to Firestore ',
      writeErr.message || writeErr
    )
    throw writeErr
  }
  return sizeOfUpdates
}
