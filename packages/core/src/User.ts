import { runValidationForClass } from './utils/validation';
import { PROJECTS_COLLECTION } from './constants/firestorePaths'
import { GetOptions, throwIfNotFoundInVal, getApp } from './utils/firebase';
import { UserValue } from './types/User';

/**
 * Fireadmin User
 */
// tslint:disable-next-line
export default class User implements UserValue {
  public path: string
  public id: string
  public ref: firebase.firestore.DocumentReference
  public listen: any
  public updatedAt?: firebase.firestore.FieldValue
  public createdAt?: firebase.firestore.FieldValue
  constructor(projectId: string, projectData?: object) {
    this.id = projectId
    this.path = `${PROJECTS_COLLECTION}/${projectId}`
    this.ref = getApp().firestore().doc(this.path)
    this.listen = this.ref.onSnapshot
    if (projectData) {
      Object.assign(this, projectData);
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
    const projectVal = throwIfNotFoundInVal(snap, options, `User not found at path: ${this.path}`)
    return new User(this.id, projectVal);
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
}
