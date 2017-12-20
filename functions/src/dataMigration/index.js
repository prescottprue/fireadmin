import * as admin from 'firebase-admin'
import { get } from 'lodash'
import safeEval from 'safe-eval'
import {
  runMigrationWithApps,
  updateResponseOnRTDB,
  updateRequestAsStarted
} from './utils'
import { getAppsFromEvent } from './serviceAccounts'
import { MIGRATION_REQUESTS_PATH, MIGRATION_MAPPING_PATH } from './constants'
import { getFirepadContent } from './firepad'
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
  const eventData = event.data.val()
  const projectId = get(eventData, 'projectId')
  const { app1, app2 } = await getAppsFromEvent(event)
  console.log('Got apps from event, running migration...')
  try {
    await updateRequestAsStarted(event)
    await runMigrationWithApps(app1, app2, event)
    const mappingPath = `${MIGRATION_MAPPING_PATH}/${projectId}`
    console.log(
      'Data backup complete. Looking for custom mapping...',
      mappingPath
    )
    const rootRef = admin.database().ref(mappingPath)
    const firepadContent = await getFirepadContent(rootRef)
    if (!firepadContent) {
      console.log('Custom mapping not found. Skipping.')
      return eventData
    }
    console.log(
      'Content loaded from Firepad. Evaluating within function context...'
    )
    const evalContext = { console, functions, admin }
    safeEval(firepadContent, evalContext)
  } catch (err) {
    console.error('Error with migration request:', err.message || err)
    await updateResponseOnRTDB(event, err)
    throw err
  }
}
