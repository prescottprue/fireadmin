import { runValidationForClass } from './utils/validation'
import { ACTION_RUNNER_REQUESTS_PATH } from './constants/firebasePaths'
import { GetOptions, throwIfNotFoundInVal } from './utils/firebase'
import { ActionRequestValue } from './types/ActionRequest'
import { ActionInputSetting, ActionStepSetting, ActionEnvironmentSetting } from './types/Action'
import RTDBItem from './connectors/RTDBItem'

/**
 * Fireadmin Action Request
 */
export default class ActionRequest extends RTDBItem {
  public id?: string
  public environments?: ActionEnvironmentSetting[]
  public inputs?: ActionInputSetting[]
  public steps?: ActionStepSetting[]
  constructor(actionId?: string, actionData?: Partial<ActionRequestValue>) {
    super(`${ACTION_RUNNER_REQUESTS_PATH}/${actionId}`)
    if (actionId) {
      this.id = actionId
    }
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
   * Create a new action request
   */
  public async create(newActionData: ActionRequestValue): Promise<ActionRequest> {
    this.validate(newActionData)
    const pushRef = await this.ref.push(newActionData)
    if (!pushRef.key) {
      throw new Error('Error creating new action request')
    }
    return new ActionRequest(pushRef.key, newActionData)
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
  public async update(actionData: ActionRequestValue): Promise<ActionRequest> {
    this.validate(actionData)
    await this.ref.update(actionData)
    return new ActionRequest(this.id, actionData)
  }
}
