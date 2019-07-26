import { FireadminConfig } from './types/index';
import { initializeFirebase, getApp } from './utils/firebase'

export * from './types/Action'

/**
 * Initialize Typesafe Client library (internally initializes Firebase)
 * @param envConfig - Firebase config
 */
export default function initialize(fbConfig: FireadminConfig) {
  initializeFirebase(fbConfig)
}

/**
 * Login with a custom token
 * @param customToken - Token to use to login to Core App
 */
export function loginWithToken(customToken: string) {
  // TODO: Support logging into both apps
  return getApp().auth().signInWithCustomToken(customToken);
}