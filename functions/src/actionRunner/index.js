import * as functions from 'firebase-functions'
import { ACTION_RUNNER_REQUESTS_PATH } from './constants'
import runAction from './runAction'

/**
 * @name actionRunner
 * Run action based on action template. Multiple Service Account Types
 * supported (i.e. stored on Firestore or cloud storage)
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref(`${ACTION_RUNNER_REQUESTS_PATH}/{pushId}`)
  .onCreate(runAction)
