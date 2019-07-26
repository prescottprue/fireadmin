import firebase from 'firebase/app'
import { USERS_COLLECTION } from './constants/firestorePaths';
import { runValidationForClass } from './utils/validation';
import User from './User'
import { UserValue } from './types/User'
import { throwIfNotFoundInData, GetOptions } from './utils/firebase'

export default class Users {
  public path?: string;
  public ref: firebase.firestore.CollectionReference | firebase.firestore.DocumentReference;
  constructor(financialTransactionsData?: object) {
    this.path = USERS_COLLECTION;
    this.ref = firebase.firestore().collection(this.path);
    if (financialTransactionsData) {
      Object.assign(this, financialTransactionsData);
    }
  }
  /**
   * Create a new User
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
   * Get a list of Users
   */
  public async get(options: GetOptions): Promise<User> {
    const snap = await this.ref.get();
    const financialTransactionsData = throwIfNotFoundInData(
      snap,
      options,
      `Users not found at path: ${this.path}`,
    );
    return new User(financialTransactionsData);
  }
}