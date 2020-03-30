import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

/**
 * @name onUserOnlineStatusChange
 * Cloud Function triggered by Real Time Database Update Event
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref('/requests/onUserOnlineStatusChange/{pushId}')
  .onUpdate(onUserOnlineStatusChangeEvent)

/**
 * @param  {functions.Event} event - Function event
 * @return {Promise}
 */
async function onUserOnlineStatusChangeEvent(change, context) {
  // Get the data written to Realtime Database
  const eventStatus = change.after.val()

  // Then use other event data to create a reference to the
  // corresponding Firestore document.
  const userStatusFirestoreRef = admin
    .firestore()
    .doc(`status/${context.params.uid}`)

  // It is likely that the Realtime Database change that triggered
  // this event has already been overwritten by a fast change in
  // online / offline status, so we'll re-read the current data
  // and compare the timestamps.
  return change.after.ref.once('value').then((statusSnapshot) => {
    const status = statusSnapshot.val()
    console.log(status, eventStatus)
    // If the current timestamp for this data is newer than
    // the data that triggered this event, we exit this function.
    if (status.last_changed > eventStatus.last_changed) {
      return null
    }

    // Otherwise, we convert the last_changed field to a Date
    eventStatus.last_changed = new Date(eventStatus.last_changed)

    // ... and write it to Firestore.
    return userStatusFirestoreRef.set(eventStatus)
  })
}
