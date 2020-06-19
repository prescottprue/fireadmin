import * as functions from 'firebase-functions'
import { ACTION_RUNNER_REQUESTS_PATH } from './constants'
import runAction from './runAction'

const runtimeOpts: functions.RuntimeOptions = {
  timeoutSeconds: 540,
  memory: '2GB'
}

/**
 * @name actionRunner
 * Run action based on action template. Multiple Service Account Types
 * supported (i.e. stored on Firestore or cloud storage)
 * @type {functions.CloudFunction}
 * @example functions shell with json file
 * actionRunner(require('./functions/test.json'))
 */
export default functions
  .runWith(runtimeOpts)
  .database.ref(`${ACTION_RUNNER_REQUESTS_PATH}/{pushId}`)
  .onCreate(runAction)
