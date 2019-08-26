import RTDBItem from './connectors/RTDBItem'
import { DISPLAY_NAMES_PATH } from './constants/firebasePaths'
import { GetOptions, throwIfNotFoundInVal } from './utils/firebase'

export default class DisplayName extends RTDBItem {
  public id: string
  public path: string
  constructor(id: string, displayNameData?: object) {
    super(`${DISPLAY_NAMES_PATH}/${id}`)
    this.id = id
    this.path = `${DISPLAY_NAMES_PATH}/${id}`
    if (displayNameData) {
      Object.assign(this, displayNameData)
    }
  }

  /**
   * Validate a DisplayName is a string
   */
  public validate(displayNameData: string) {
    if (typeof displayNameData !== 'string') {
      throw new Error('Display name must be a string')
    }
  }
  /**
   * Update a DisplayName (uses JSON schema for validation)
   */
  public update(displayNameData: string): Promise<any> {
    this.validate(displayNameData)
    return super.update(displayNameData)
  }
  /**
   * Get a DisplayName and throw if is not found
   */
  public async get(options?: GetOptions): Promise<DisplayName> {
    const snap = await super.getSnapshot()
    const displayNameVal = throwIfNotFoundInVal(
      snap,
      options,
      `DisplayName not found at path: ${this.path}`
    )
    return new DisplayName(this.id, displayNameVal)
  }
}
