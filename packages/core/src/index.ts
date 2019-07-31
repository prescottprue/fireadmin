import { FireadminConfig } from './types/index';
import { initializeFirebase, getApp } from './utils/firebase'

/**
 * Initialize Typesafe Client library (internally initializes Firebase)
 * @param envConfig - Firebase config
 */
export function initialize(fireadminConfig: FireadminConfig) {
  initializeFirebase(fireadminConfig)
}

/**
 * Login with a custom token
 * @param customToken - Token to use to login to Core App
 */
export function loginWithToken(customToken: string) {
  // TODO: Support logging into both apps
  return getApp().auth().signInWithCustomToken(customToken);
}

import Project from './Project';
import Projects from './Projects';
import Users from './Users';
import User from './User';
export { Projects, Project, Users, User };

export default initialize