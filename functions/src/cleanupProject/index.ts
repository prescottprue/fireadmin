import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { to } from '../utils/async'

/**
 * Remove collection provided the snap (handles removing subcollections)
 * @param collectionSnap - Snapshot of collection to remove
 * @returns {Promise} Results of removing collection
 */
async function removeCollection(
  collectionSnap: admin.firestore.CollectionReference
) {
  const [getErr, collectionQueryResult] = await to(collectionSnap.get())
  // Handle errors getting collection data
  if (getErr) {
    console.error('Error data for collection: ', getErr.message || getErr)
    throw getErr
  }
  if (!collectionQueryResult.size) {
    console.log(`No docs in ${collectionSnap.id}, removing all collections`)
    await removeAllCollections(collectionSnap)
    return null
  }
  console.log(
    `Removing ${collectionQueryResult.size} docs from the "${collectionSnap.id}" subcollection`
  )

  // Remove all documents from collection (removing the document's
  // subcollections first if they exist)
  return Promise.all(
    collectionQueryResult.docs.map(async (docSnap) => {
      // Remove all subcollections before deleting document
      const [deleteSubcollectionsErr] = await to(
        removeAllCollections(docSnap.ref)
      )
      // Handle issues deleteing subcollections
      if (deleteSubcollectionsErr) {
        console.error(
          `Error deleting doc: "${collectionSnap.id}/${docSnap.id}"`,
          deleteSubcollectionsErr
        )
        // Continue on to deleting document anyway
      }
      // Delete document
      const [deleteErr] = await to(docSnap.ref.delete())
      // Handle errors deleting document
      if (deleteErr) {
        console.error(
          `Error deleting doc: "${collectionSnap.id}/${docSnap.id}"`,
          deleteErr
        )
        throw deleteErr
      }
    })
  )
}

/**
 * Remove all collections from a Firestore document
 * @param {object} docRef - Reference of document for which all collections
 * will be deleted
 * @returns {Promise} Resolves with results of removing all collections
 */
async function removeAllCollections(docRef: any) {
  if (!docRef.getCollections) {
    throw new Error('docRef.getCollections does not exist')
  }
  // all collection names
  // TODO: getCollections (including updating tests)
  const [getCollectionsErr, collectionSnaps] = await to(
    docRef.getCollections()
  )
  // Handle errors in batch write
  if (getCollectionsErr) {
    console.error(
      'Error getting collections: ',
      getCollectionsErr.message || getCollectionsErr
    )
    throw getCollectionsErr
  }
  // Exit if document does not have subcollections
  if (!collectionSnaps.length) {
    return null
  }
  // Remove each collection
  return Promise.all(collectionSnaps.map(removeCollection))
}

/**
 * @param {functions.firestore.DocumentSnapshot} snap - Snapshot of event
 * @param {functions.EventContext} context - Function's context
 * @returns {Promise} Resolves with null
 */
async function cleanupProjectEvent(snap, context) {
  const [removeErr] = await to(removeAllCollections(snap.ref))
  if (removeErr) {
    console.error(
      `Error removing sub-collections for project: ${snap.id}`,
      removeErr
    )
    throw removeErr
  }
  console.log(`Cleanup successful for project: ${snap.id}`)
  return null
}

/**
 * @name cleanupProject
 * Cloud Function triggered by Firestore Event
 * @type {functions.CloudFunction}
 */
export default functions.firestore
  .document('projects/{projectId}')
  .onDelete(cleanupProjectEvent)
