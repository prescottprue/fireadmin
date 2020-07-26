import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { to } from '../utils/async'

/**
 * Remove collection provided the snap (handles removing subcollections)
 * @param collectionSnap - Snapshot of collection to remove
 * @returns Results of removing collection
 */
async function removeCollection(
  collectionSnap: admin.firestore.CollectionReference
): Promise<null | any[]> {
  // TODO: Handle deleting documents in batches
  const [getErr, collectionQueryResult] = await to(collectionSnap.get())

  // Handle errors getting collection data
  if (getErr) {
    console.error(`Error getting data for collection "${collectionSnap.id}": `, getErr.message)
    throw getErr
  }

  // Handle no docs existing in collection
  if (!collectionQueryResult.size) {
    console.log(`No docs in ${collectionSnap.id}, removing all collections`)
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
        removeAllCollections(docSnap)
      )

      // Handle issues deleteing subcollections
      if (deleteSubcollectionsErr) {
        console.error(
          `Error deleting doc subcollections: "${collectionSnap.id}/${docSnap.id}"`,
          deleteSubcollectionsErr
        )
        throw deleteSubcollectionsErr
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
 * @param docRef - Reference of document for which all collections
 * will be deleted
 * @returns Resolves with results of removing all collections
 */
async function removeAllCollections(
  snap: admin.firestore.DocumentSnapshot
): Promise<null | any[]> {
  const [getCollectionsErr, collectionSnaps] = await to(
    snap.ref.listCollections()
  )

  // Handle errors in batch write
  if (getCollectionsErr) {
    console.error(
      `Error getting collections for document with id ${snap.id}: `,
      getCollectionsErr.message
    )
    throw getCollectionsErr
  }

  // Exit if document does not have subcollections
  if (!collectionSnaps?.length) {
    console.log('collections snaps length not there')
    return null
  }

  // Remove each collection
  return Promise.all(collectionSnaps.map(removeCollection))
}

/**
 * @param snap - Snapshot of event
 * @returns Resolves with null
 */
async function cleanupProjectEvent(
  snap: admin.firestore.DocumentSnapshot,
  context: functions.EventContext
): Promise<null> {
  const { projectId } = context.params
  console.log(`Starting to cleanup project "${projectId}"`)
  try {
    await removeAllCollections(snap)
  } catch(removeErr) {
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
