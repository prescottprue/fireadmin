import * as firebase from 'firebase/app'
import { ACTION_RUNNER_REQUESTS_PATH } from './constants/firebasePaths'
import { runValidationForClass } from './utils/validation'
import { ActionRequestValue } from './types/ActionRequest'
import {
  GetOptions,
  snapToItemsArray,
  getApp,
  snapToArray
} from './utils/firebase'
import ActionRequest from './ActionRequest'

export default class ActionRequests {
  public path?: string
  public ref: firebase.database.Reference
  constructor(templateData?: object) {
    this.path = ACTION_RUNNER_REQUESTS_PATH
    this.ref = getApp()
      .database()
      .ref(ACTION_RUNNER_REQUESTS_PATH)
    if (templateData) {
      Object.assign(this, templateData)
    }
  }
  /**
   * Create a new Action Request
   */
  public async create(
    newActionRequest: ActionRequestValue
  ): Promise<ActionRequest> {
    await runValidationForClass(ActionRequest, newActionRequest)
    const pushRef = await this.ref.push(newActionRequest)
    if (!pushRef.key) {
      throw new Error('Error creating new action request')
    }
    return new ActionRequest(pushRef.key, newActionRequest)
  }

  /**
   * Get a list of ActionRequests
   */
  public async get(options?: GetOptions): Promise<ActionRequest[] | object[]> {
    const snap = await this.ref.once('value')
    if (options && options.json) {
      return snapToArray(snap)
    }
    return snapToItemsArray(
      snap,
      (projectsSnap: firebase.firestore.DocumentData | undefined) => {
        if (projectsSnap) {
          return !projectsSnap.id
            ? projectsSnap.data()
            : new ActionRequest(projectsSnap.id, projectsSnap.data())
        }
      }
    )
  }
}
