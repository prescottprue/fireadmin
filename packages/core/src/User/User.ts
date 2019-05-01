import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { USERS_PATH } from '../constants/firebasePaths';
import UserValue from './UserValue'

/**
 * Fireadmin Project
 */
export default class User extends UserValue {
  constructor(userId: string) {
    this.id = userId
    this.path = `${USERS_PATH}/${userId}`
    this.ref = firebase.firestore().doc(this.path)
    this.listen = this.ref.onSnapshot
  }
  path: string
  id: string
  ref: firebase.firestore.DocumentReference
  listen: any

  /**
   * Get Project value of Fireadmin project
   */
  get(): Promise<UserValue> {
    return this.ref.get().then((docSnap) => {
      return new ProjectValue(docSnap)
    })
  }

  update(values: Object): Promise<any> {
    return this.ref.update(values)
  }

  delete() {
    return this.ref.delete()
  }

  validate() {

  }
}