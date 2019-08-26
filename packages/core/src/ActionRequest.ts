import { runValidationForClass } from './utils/validation'
import { ACTION_RUNNER_REQUESTS_PATH } from './constants/firebasePaths'
import { GetOptions, throwIfNotFoundInVal } from './utils/firebase'
import { ActionRequestValue } from './types/ActionRequest'
import RTDBItem from './connectors/RTDBItem'

/**
 * Fireadmin Action Request
 */
export default class ActionRequest extends RTDBItem
  implements ActionRequestValue {
  public id: string
  public updatedAt?: firebase.firestore.FieldValue
  public createdAt?: firebase.firestore.FieldValue
  constructor(actionId: string, actionData?: object) {
    super(`${ACTION_RUNNER_REQUESTS_PATH}/${actionId}`)
    this.id = actionId
    if (actionData) {
      Object.assign(this, actionData)
    }
  }
  /**
   * Validate an ActionRequest using JSON schema
   */
  public validate(actionData: ActionRequestValue) {
    runValidationForClass(ActionRequest, actionData)
  }
  /**
   * Get an ActionRequest and throw if is not found
   */
  public async get(options?: GetOptions): Promise<ActionRequest> {
    const snap = await this.ref.once('value')
    const projectVal = throwIfNotFoundInVal(
      snap,
      options,
      `ActionRequest not found at path: ${this.path}`
    )
    return new ActionRequest(this.id, projectVal)
  }

  /**
   * Update a ActionRequest (uses JSON schema for validation)
   */
  public update(actionData: ActionRequestValue): Promise<any> {
    this.validate(actionData)
    return this.ref.update(actionData)
  }
}
