import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import { rtdbRef } from '../utils/firebase'

/**
 * Representation of an object or value which lives on Real Time Database. Similar
 * to firebase.database.DataSnapshot, but with our own custom methods.
 */
export default class RTDBItem {
  public path: string | undefined
  public listen: Function
  constructor(path: string | undefined) {
    this.path = path;
    this.listen = this.ref.on
  }

  get ref(): firebase.database.Reference {
    if (!this.path) {
      throw new Error('Path must be defined to create ref')
    }
    return rtdbRef(this.path)
  }

  get(): Promise<any> {
    return this.getSnapshot().then((snap) => snap.val())
  }

  public getSnapshot(): Promise<firebase.database.DataSnapshot> {
    return this.ref.once('value')
  }

  set(values: Object, onComplete?: (a: Error | null) => any): Promise<any> {
    return this.ref.update(values, onComplete)
  }

  update(values: Object, onComplete?: (a: Error | null) => any): Promise<any> {
    return this.ref.update(values, onComplete)
  }

  public delete() {
    return this.ref.remove()
  }
}
