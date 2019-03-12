import firebase from 'firebase/app';
import 'firebase/firestore';

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
    console.warn('You only need to initialize Firebase once', JSON.stringify(err))
  }

  return firebaseApp
}

export function storage(): firebase.storage.Storage {
  return firebase.storage()
}