import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { to } from 'utils/async'

/**
 * @name moveToFirestore
 * Cloud Function triggered by Real Time Database Create Event
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref('/requests/moveToFirestore/{pushId}')
  .onCreate(moveToFirestoreEvent)

/**
 * @param  {functions.Event} event - Function event
 * @return {Promise}
 */
async function moveToFirestoreEvent(event) {
  const eventData = event.data.val()
  const params = event.params
  const ref = admin.database().ref('responses')
  const [writeErr, response] = await to(ref.push(eventData))
  if (writeErr) {
    console.error('Error writing response:', writeErr.message || writeErr)
    throw writeErr
  }
  return response
}
