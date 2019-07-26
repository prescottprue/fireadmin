import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';

let firebaseApp: firebase.app.App

/**
 * @description Initialize firebase application
 */
export function initializeFirebase(fbConfig: any): firebase.app.App {
  if (firebaseApp) {
    return firebaseApp
  }
  if (fbConfig.auth) {
    firebaseApp = fbConfig
  } else if (fbConfig.credential) {
    firebaseApp = firebase.initializeApp(fbConfig)
  } else {
    try {
      firebaseApp = firebase.initializeApp(fbConfig)
    } catch (err) {
      console.warn('You only need to initialize Firebase once', JSON.stringify(err))
    }
  }

  return firebaseApp
}

export function getApp() {
  if (!firebaseApp) {
    console.warn('App instance does not exist, make sure to call initialize')
  }
  return firebaseApp
}

export function storage(): firebase.storage.Storage {
  return firebaseApp.storage()
}

/**
 * Get Real Time Database Reference at provided path.
 * @param {String} refPath - Path of real time database reference
 * @return {firebase.database.Reference} Reference at provided path
 * @memberof utils
 */
export function rtdbRef(refPath: string): firebase.database.Reference {
  try {
    return firebaseApp.database().ref(refPath);
  } catch (e) {
    console.error('Problem reading from ref', refPath);
    throw e;
  }
}

/**
 * Get Firestore Reference at provided path (works for collections and docs)
 * @param {String} refPath - Path of real time database reference
 * @return Reference at provided path
 * @memberof utils
 */
export function firestoreRef(refPath: string): firebase.firestore.CollectionReference | firebase.firestore.DocumentReference {
  const isDocPath = refPath.split('/').length % 2
  return isDocPath
    ? firebaseApp.firestore().doc(refPath)
    : firebaseApp.firestore().collection(refPath);
}

export interface GetOptions {
  resolveForNotFound?: Boolean
}

/**
 * Throw if a snapshot value does not exist, otherwise return the value.
 * @param snap - Database Snapshot from which to check for value
 * @param opts - Get options
 * @param opts.resolveForNotFound - Option to allow for resolving if item is not found
 * @param errMsg 
 */
export function throwIfNotFoundInVal(snap: firebase.database.DataSnapshot | firebase.firestore.DocumentSnapshot, opts?: GetOptions, errMsg?: string): any {
  const { resolveForNotFound = false }: GetOptions = opts || {}
  let itemVal
  if (snap instanceof firebase.firestore.DocumentSnapshot) {
    itemVal = snap.data()
  } else if (typeof snap.val === 'function') {
    itemVal = snap.val()
  }
  if (!resolveForNotFound && !itemVal) {
    throw new Error(errMsg || 'Not Found in Database')
  }
  return itemVal
}

function valFromSnap(snap: firebase.firestore.DocumentSnapshot | firebase.firestore.QuerySnapshot) {
  if (snap instanceof firebase.firestore.DocumentSnapshot) {
    return snap.data()
  }
  if (snap instanceof firebase.firestore.QuerySnapshot) {
    return snapToArray(snap)
  }
}

/**
 * Throw if a snapshot value does not exist, otherwise return the value.
 * @param snap - Database Snapshot from which to check for value
 * @param opts - Get options
 * @param opts.resolveForNotFound - Option to allow for resolving if item is not found
 * @param errMsg 
 */
export function throwIfNotFoundInData(snap: firebase.firestore.DocumentSnapshot | firebase.firestore.QuerySnapshot, opts?: GetOptions, errMsg?: string): any {
  const { resolveForNotFound = false }: GetOptions = opts || {}
  const itemVal = valFromSnap(snap)
  if (!resolveForNotFound && !itemVal) {
    throw new Error(errMsg || 'Not Found in Firestore')
  }
  return itemVal
}

/**
 * Get data at RTDB path.
 * @param ref - Path of real time database reference
 * or reference itself.
 * @return Resolves with database shapshot of data at provided path
 */
export function rtdbSnap(ref: firebase.database.Reference | firebase.database.Query | string): Promise<firebase.database.DataSnapshot> {
  if (typeof ref === 'string') {
    // this is actually a path
    return rtdbSnap(rtdbRef(ref));
  }
  return ref.once('value');
}

/**
 * Get value from RTDB reference path
 * @param ref - Path of real time database reference
 * or reference itself.
 * @return Promise which resolves with value at database location
 */
export function rtdbVal(ref: firebase.database.Reference | string): Promise<any> {
  return rtdbSnap(ref).then(refSnap => refSnap.val());
}

/**
 * Convert snapshot object into an array of document snapshots
 * ordered based on query order (lexographically by key is default from Firebase).
 * @param snap - Snapshot object to run forEach on
 * @return Array of child snapshots
 * @memberof utils
 */
export function snapToArray(
  snap: firebase.database.DataSnapshot | firebase.firestore.QuerySnapshot,
  filterFunc?: (docSnap: firebase.database.DataSnapshot) => boolean
): Array<firebase.database.DataSnapshot> {
  const snapResults: Array<firebase.database.DataSnapshot> = [];
  snap.forEach((doc: any) => {
    if (!filterFunc) {
      snapResults.push(doc);
    } else {
      const passesFilter = filterFunc(doc)
      if (passesFilter) {
        snapResults.push(doc);
      }
    }
  });
  return snapResults;
}

export function snapToItemsArray<T>(
  snap: firebase.database.DataSnapshot,
  classFactory: (docSnap: firebase.database.DataSnapshot) => T
): Array<T> {
  const snapResults: Array<T> = [];
  snap.forEach((doc) => {
    const result = classFactory(doc)
    snapResults.push(result);
  });
  return snapResults;
}

/**
 * Login to Firebase with a custom token
 * @param customToken - Token to use to login to Core App
 */
export function loginWithToken(customToken: string) {
  return getApp().auth().signInWithCustomToken(customToken)
}
