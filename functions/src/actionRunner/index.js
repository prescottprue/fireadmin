import { runActionWithApps } from './steps'
import { updateResponseOnRTDB, updateRequestAsStarted } from './utils'
import { getAppsFromEvent } from '../utils/serviceAccounts'
import { ACTION_RUNNER_REQUESTS_PATH } from './constants'
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
  const { app1, app2 } = await getAppsFromEvent(event)
  console.log('Got apps from event, running action...')
  try {
    await updateRequestAsStarted(event)
    await runActionWithApps(app1, app2, event)
    console.log('action completed successfully')
  } catch (err) {
    console.error('Error with action request:', err.message || err)
    await updateResponseOnRTDB(event, err)
    throw err
  }
}
