import { FireadminConfig } from './types/index'
import { initializeFirebase } from './utils/firebase'
import { loginWithApiKey } from './auth'
import Project from './Project'
import Projects from './Projects'
import ActionRequest from './ActionRequest'
import ActionTemplates from './ActionTemplates'
import ActionTemplate from './ActionTemplate'
import Users from './Users'
import User from './User'
import {
  ActionEnvironmentSetting,
  ActionSettings,
  ActionInputSetting,
  CustomActionStepSetting
} from './types/Action'

/**
 * Initialize Typesafe Client library (internally initializes Firebase)
 * @param envConfig - Firebase config
 */
export function initialize(fireadminConfig: FireadminConfig) {
  initializeFirebase(fireadminConfig)
}

export {
  Projects,
  Project,
  Users,
  User,
  ActionTemplates,
  ActionTemplate,
  ActionRequest,
  loginWithApiKey,
  ActionEnvironmentSetting,
  ActionSettings,
  ActionInputSetting,
  CustomActionStepSetting
}

export default initialize
