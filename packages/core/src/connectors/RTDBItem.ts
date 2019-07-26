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
  constructor(path: string | undefined) {
    this.path = path;
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

  public listen(
    eventType: firebase.database.EventType = 'value',
    callback: (a: firebase.database.DataSnapshot | null, b: string | null | undefined) => any
  ): (a: firebase.database.DataSnapshot | null, b: string | null | undefined) => any {
    return this.ref.on(eventType, callback)
  }

  set(values: Object, onComplete?: (a: Error | null) => any): Promise<any> {
    return this.ref.update(values, onComplete)
  }

  update(values: Object, onComplete?: (a: Error | null) => any): Promise<any> {
    return this.ref.update(values, onComplete)
  }

  public remove() {
    return this.ref.remove()
  }
}
