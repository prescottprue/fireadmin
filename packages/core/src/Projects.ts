import * as firebase from 'firebase/app'
import { PROJECTS_COLLECTION } from './constants/firestorePaths';
import { runValidationForClass } from './utils/validation';
import User from './User'
import { UserValue } from './types/User'
import { GetOptions, snapToItemsArray, getApp } from './utils/firebase'
import Project from './Project';

export default class Projects {
  public path?: string;
  public ref: firebase.firestore.CollectionReference | firebase.firestore.DocumentReference;
  constructor(financialTransactionsData?: object) {
    this.path = PROJECTS_COLLECTION;
    this.ref = getApp().firestore().collection(this.path);
    if (financialTransactionsData) {
      Object.assign(this, financialTransactionsData);
    }
  }
  /**
   * Create a new Project
   */
  public async create(
    newUserData: UserValue,
  ): Promise<User> {
    await runValidationForClass(User, newUserData);
    if (this.ref instanceof firebase.firestore.DocumentReference) {
      throw new Error('Add requires a document reference');
    }
    const { id } = await this.ref.add(newUserData);
    return new User(id, newUserData);
  }
  /**
   * Get a list of Projects
   */
  public async get(options?: firebase.firestore.GetOptions): Promise<Project[]> {
    const snap = await this.ref.get(options);
    return snapToItemsArray(snap, (projectsSnap: firebase.firestore.DocumentData | undefined) => {
      if (projectsSnap) {
        return !projectsSnap.id ? projectsSnap.data() : new Project(projectsSnap.id, projectsSnap.data())
      }
    });
  }
}