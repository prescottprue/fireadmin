import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { runValidationForClass } from './utils/validation';
import { PROJECTS_COLLECTION, PROJECTS_ENVIRONMENTS_COLLECTION } from './constants/firestorePaths'
import { GetOptions, throwIfNotFoundInVal, snapToItemsArray } from './utils/firebase';
import { ProjectEnvironmentValue } from './types/ProjectEnvironment';

/**
 * Fireadmin Project
 */
// tslint:disable-next-line
export default class ProjectEnvironment {
  public path: string
  public id: string
  public ref: firebase.firestore.DocumentReference
  public listen: any
  public updatedAt?: firebase.firestore.FieldValue
  public createdAt?: firebase.firestore.FieldValue
  constructor(projectId: string, environmentId: string, environmentData?: object) {
    this.id = projectId
    this.path = `${PROJECTS_COLLECTION}/${projectId}/${PROJECTS_ENVIRONMENTS_COLLECTION}/${environmentId}`
    this.ref = firebase.firestore().doc(this.path)
    this.listen = this.ref.onSnapshot
    if (environmentData) {
      Object.assign(this, environmentData);
    }
  }
  /**
   * Validate a Project using JSON schema
   */
  public validate(environmentData: ProjectEnvironmentValue) {
    runValidationForClass(ProjectEnvironment, environmentData);
  }
  /**
   * Get a Project and throw if is not found
   */
  public async get(options?: GetOptions): Promise<ProjectEnvironment> {
    const snap = await this.ref.get();
    const projectVal = throwIfNotFoundInVal(snap, options, `Project Environment not found at path: ${this.path}`)
    return new ProjectEnvironment(this.id, projectVal);
  }

  /**
   * Update a Project (uses JSON schema for validation)
   */
  public update(projectData: ProjectEnvironmentValue): Promise<any> {
    this.validate(projectData);
    return this.ref.update(projectData)
  }

  public delete() {
    return this.ref.delete()
  }
}
