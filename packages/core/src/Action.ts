import * as firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/firestore'
import { runValidationForClass } from './utils/validation';
import { ACTION_RUNNER_REQUESTS_PATH } from './constants/firebasePaths'
import { GetOptions, throwIfNotFoundInVal } from './utils/firebase';
import { ActionValue } from './types/Action';
export * from './types/Action'

/**
 * Fireadmin Action
 */
export default class Action implements ActionValue {
  public path: string
  public id: string
  public ref: firebase.firestore.DocumentReference
  public listen: any
  public updatedAt?: firebase.firestore.FieldValue
  public createdAt?: firebase.firestore.FieldValue
  constructor(actionId: string, actionData?: object) {
    this.id = actionId
    this.path = `${ACTION_RUNNER_REQUESTS_PATH}/${actionId}`
    this.ref = firebase.firestore().doc(this.path)
    this.listen = this.ref.onSnapshot
    if (actionData) {
      Object.assign(this, actionData);
    }
  }
  /**
   * Validate an Action using JSON schema
   */
  public validate(actionData: ActionValue) {
    runValidationForClass(Action, actionData);
  }
  /**
   * Get an Action and throw if is not found
   */
  public async get(options?: GetOptions): Promise<Action> {
    const snap = await this.ref.get();
    const projectVal = throwIfNotFoundInVal(snap, options, `Action not found at path: ${this.path}`)
    return new Action(this.id, projectVal);
  }

  /**
   * Update a Action (uses JSON schema for validation)
   */
  public update(actionData: ActionValue): Promise<any> {
    this.validate(actionData);
    return this.ref.update(actionData)
  }

  public delete() {
    return this.ref.delete()
  }
}
