import { runValidationForClass } from './utils/validation';
import { USERS_COLLECTION } from './constants/firestorePaths'
import { GetOptions, throwIfNotFoundInVal, getApp } from './utils/firebase';
import { UserValue } from './types/User';

/**
 * Fireadmin User
 */
export default class User implements UserValue {
  public path: string
  public id: string
  public ref: firebase.firestore.DocumentReference
  public listen: any
  public updatedAt?: firebase.firestore.FieldValue
  public createdAt?: firebase.firestore.FieldValue
  constructor(uid: string, userData?: object) {
    this.id = uid
    this.path = `${USERS_COLLECTION}/${uid}`
    this.ref = getApp().firestore().doc(this.path)
    this.listen = this.ref.onSnapshot
    if (userData) {
      Object.assign(this, userData);
    }
  }
  /**
   * Validate a User using JSON schema
   */
  public validate(projectData: UserValue) {
    runValidationForClass(User, projectData);
  }
  /**
   * Get a User and throw if is not found
   */
  public async get(options?: GetOptions): Promise<User> {
    const snap = await this.ref.get();
    const userVal = throwIfNotFoundInVal(snap, options, `User not found at path: ${this.path}`)
    return new User(this.id, userVal);
  }

  /**
   * Update a User (uses JSON schema for validation)
   */
  public update(projectData: UserValue): Promise<any> {
    this.validate(projectData);
    return this.ref.update(projectData)
  }

  public delete() {
    return this.ref.delete()
  }

  public async generateApiKey() {
    await getApp()
      .functions()
      .httpsCallable('generateApiKey')({ uid: this.id })
      .catch(err => {
        console.error('Error generating token:', err.message || err) // eslint-disable-line no-console
        return Promise.reject(err)
      })
  }
}
