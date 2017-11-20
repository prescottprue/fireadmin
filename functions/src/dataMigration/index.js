import {
  runMigrationWithApps,
  updateResponseOnRTDB,
  updateRequestAsStarted
} from './utils'
import { getAppsFromEvent } from './serviceAccounts'
import { MIGRATION_REQUESTS_PATH } from './constants'
const functions = require('firebase-functions')

/**
 * @name dataMigration
 * Migrate data. Multiple serviceAccountTypes supported (i.e. stored on
 * Firestore or cloud storage)
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref(`${MIGRATION_REQUESTS_PATH}/{pushId}`)
  .onCreate(handleMigrateRequest)

async function handleMigrateRequest(event) {
  console.log('Running migration', event.data.val())
  const { app1, app2 } = await getAppsFromEvent(event)
  console.log('Got apps from event, running migration...')
  try {
    await updateRequestAsStarted(event)
    await runMigrationWithApps(app1, app2, event)
  } catch (err) {
    console.error('Error with migration request:', err.message || err)
    await updateResponseOnRTDB(event, err)
    throw err
  }
}
