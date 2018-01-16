import { updateResponseOnRTDB, updateRequestAsStarted } from './utils'
import { ACTION_RUNNER_REQUESTS_PATH } from './constants'
import { runStepsFromEvent } from './steps'
const functions = require('firebase-functions')

/**
 * @name dataaction
 * Migrate data. Multiple serviceAccountTypes supported (i.e. stored on
 * Firestore or cloud storage)
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref(`${ACTION_RUNNER_REQUESTS_PATH}/{pushId}`)
  .onCreate(handleMigrateRequest)

async function handleMigrateRequest(event) {
  console.log('Running action', event.data.val())
  try {
    await updateRequestAsStarted(event)
    await runStepsFromEvent(event)
    console.log('Action completed successfully!')
  } catch (err) {
    console.error('Error with action request:', err.message || err)
    await updateResponseOnRTDB(event, err)
    throw err
  }
}
