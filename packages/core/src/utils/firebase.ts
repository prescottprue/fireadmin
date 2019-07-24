import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'

let firebaseApp: firebase.app.App

/**
 * @description Initialize firebase application
 */
export function init(fbConfig: object): firebase.app.App {
  try {
    if (!firebaseApp) {
      firebaseApp = firebase.initializeApp(fbConfig)
    }
  } catch (err) {
    /* eslint-disable no-console */
    console.warn(
      'You only need to initialize Firebase once',
      JSON.stringify(err)
    )
    /* eslint-enable no-console */
  }

  return firebaseApp
}

export function storage(): firebase.storage.Storage {
  return firebase.storage()
}

/**
 * Get Real Time Database Reference at provided path.
 * @param {String} refPath - Path of real time database reference
 * @return {firebase.database.Reference} Reference at provided path
 * @memberof utils
 */
export function rtdbRef(refPath: string): firebase.database.Reference {
  try {
    return firebase.database().ref(refPath)
  } catch (e) {
    /* eslint-disable no-console */
    console.error('Problem reading from ref', refPath)
    /* eslint-enable no-console */
    throw e
  }
}

/**
 * Get data at RTDB path.
 * @param ref - Path of real time database reference
 * or reference itself.
 * @return Resolves with database shapshot of data at provided path
 */
export function rtdbSnap(
  ref: firebase.database.Reference | firebase.database.Query | string
): Promise<firebase.database.DataSnapshot> {
  if (typeof ref === 'string') {
    // this is actually a path
    return rtdbSnap(rtdbRef(ref))
  }
  return ref.once('value')
}

/**
 * Get value from RTDB reference path
 * @param ref - Path of real time database reference
 * or reference itself.
 * @return Promise which resolves with value at database location
 */
export function rtdbVal(
  ref: firebase.database.Reference | string
): Promise<any> {
  return rtdbSnap(ref).then(refSnap => refSnap.val())
}

/**
 * Convert snapshot object into an array of document snapshots
 * ordered based on query order (lexographically by key is default from Firebase).
 * @param {Firebase.Database.Snapshot|Firebase.Firestore.CollectionSnapshot} snap - Snapshot object to run forEach on
 * @return {Array} - Array of child snapshots
 * @memberof utils
 */
export function snapToArray(
  snap: firebase.database.DataSnapshot,
  filterFunc?: (docSnap: firebase.database.DataSnapshot) => boolean
): firebase.database.DataSnapshot[] {
  const snapResults: firebase.database.DataSnapshot[] = []
  snap.forEach(doc => {
    if (!filterFunc) {
      snapResults.push(doc)
    } else {
      const passesFilter = filterFunc(doc)
      if (passesFilter) {
        snapResults.push(doc)
      }
    }
  })
  return snapResults
}
