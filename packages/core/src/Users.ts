import * as firebase from 'firebase/app'
import { USERS_COLLECTION } from './constants/firestorePaths'
import { runValidationForClass } from './utils/validation'
import User from './User'
import { UserValue } from './types/User'
import {
  throwIfNotFoundInData,
  snapToItemsArray,
  GetOptions,
  getApp
} from './utils/firebase'

export default class Users {
  public path?: string
  public ref: firebase.firestore.CollectionReference
  constructor(financialTransactionsData?: object) {
    this.path = USERS_COLLECTION
    this.ref = getApp()
      .firestore()
      .collection(this.path)
    if (financialTransactionsData) {
      Object.assign(this, financialTransactionsData)
    }
  }
  /**
   * Create a new User
   */
  public async create(newUserData: UserValue): Promise<User> {
    await runValidationForClass(User, newUserData)
    const { id } = await this.ref.add(newUserData)
    return new User(id, newUserData)
  }
  /**
   * Get a list of Users
   */
  public async get(options?: GetOptions): Promise<User[] | object[]> {
    const snap = await this.ref.get(options)
    const usersData = throwIfNotFoundInData(
      snap,
      options,
      `Users not found at path: ${this.path}`
    )
    if (options && options.json) {
      return usersData
    }
    return snapToItemsArray(
      snap,
      (projectsSnap: firebase.firestore.DocumentData | undefined) => {
        if (projectsSnap) {
          return !projectsSnap.id
            ? projectsSnap.data()
            : new User(projectsSnap.id, projectsSnap.data())
        }
      }
    )
  }
}
