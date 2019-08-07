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
export async function loginWithToken(customToken: string) {
  try {
    initializeFirebase()
  } catch(err) {
    console.log('Error initializing firebase', err)
    throw err
  }
  const currentUser = getApp().auth().currentUser
  if (currentUser) {
    return currentUser
  }
  return getApp().auth().signInWithCustomToken(customToken);
}

import Project from './Project';
import Projects from './Projects';
import ActionTemplates from './ActionTemplates';
import ActionTemplate from './ActionTemplate';
import Users from './Users';
import User from './User';
export { Projects, Project, Users, User, ActionTemplates, ActionTemplate };

export default initialize