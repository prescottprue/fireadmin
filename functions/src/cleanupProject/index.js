import * as functions from 'firebase-functions'
import { to } from '../utils/async'

async function removeCollection(collectionSnap) {
  const [getErr, collection] = await to(collectionSnap.ref.get())
  // Handle errors in batch write
  if (getErr) {
    console.error('Error data for collection: ', getErr.message || getErr)
    throw getErr
  }
  const docRefs = []
  collection.forEach(doc => {
    docRefs.push(doc.ref)
  })
  return Promise.all(
    docRefs.map(docRef =>
      docRef
        .delete()
        .then(() => {
          console.log('deleted doc:')
        })
        .catch(err => {
          console.error('error deleting doc:', err)
          return Promise.reject(err)
        })
    )
  )
}

async function removeAllCollections(docRef) {
  // all collection names
  const [getCollectionsErr, collectionSnaps] = await to(docRef.getCollections())
  // Handle errors in batch write
  if (getCollectionsErr) {
    console.error(
      'Error getting collections: ',
      getCollectionsErr.message || getCollectionsErr
    )
    throw getCollectionsErr
  }
  const snaps = []
  collectionSnaps.forEach(collectionSnap => {
    snaps.push(collectionSnap)
  })
  return Promise.all(snaps.map(removeCollection))
}

/**
 * @param  {functions.Event} event - Function event
 * @return {Promise}
 */
async function cleanupProjectEvent(snap, context) {
  const [removeErr] = await to(removeAllCollections(snap.ref))
  if (removeErr) {
    console.error('Error removing collections:', removeErr)
    throw removeErr
  }
  console.log('Collections removed successfully!')
}

/**
 * @name cleanupProject
 * Cloud Function triggered by Firestore Event
 * @type {functions.CloudFunction}
 */
export default functions.firestore
  .document('projects/{projectId}')
  .onDelete(cleanupProjectEvent)
