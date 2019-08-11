import { FireadminConfig } from './types/index';
import { initializeFirebase, getApp } from './utils/firebase'
import { loginWithApiKey } from './auth'
import Project from './Project';
import Projects from './Projects';
import ActionTemplates from './ActionTemplates';
import ActionTemplate from './ActionTemplate';
import Users from './Users';
import User from './User';

/**
 * Initialize Typesafe Client library (internally initializes Firebase)
 * @param envConfig - Firebase config
 */
export function initialize(fireadminConfig: FireadminConfig) {
  initializeFirebase(fireadminConfig)
}

export { Projects, Project, Users, User, ActionTemplates, ActionTemplate, loginWithApiKey };

export default initialize