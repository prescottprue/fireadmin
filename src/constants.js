export const LIST_PATH = '/projects'
export const ACCOUNT_PATH = '/account'
export const LOGIN_PATH = '/login'
export const SIGNUP_PATH = '/signup'
export const ACTION_TEMPLATES_PATH = '/action-templates'
export const NEW_ACTION_TEMPLATE_PATH = '/actions'
export const PROJECT_ACTION_PATH = 'actions'
export const PROJECT_ENVIRONMENTS_PATH = 'environments'
export const PROJECT_EVENTS_PATH = 'events'
export const ACCOUNT_FORM_NAME = 'account'
export const LOGIN_FORM_NAME = 'login'
export const SIGNUP_FORM_NAME = 'signup'
export const NEW_PROJECT_FORM_NAME = 'newProject'
export const PROJECT_BUCKET_CONFIG_PATH = 'bucketConfig'
export const PERMISSIONS_PATH = 'permissions'

export const ANALYTICS_EVENT_NAMES = {
  login: 'Login',
  signup: 'Signup',
  createProject: 'Create Project',
  deleteProject: 'Delete Project',
  bucketAction: 'Storage Bucket Action',
  createEnvironment: 'Create Environment',
  updateEnvironment: 'Update Environment',
  deleteEnvironment: 'Delete Environment',
  updatePermissions: 'Update Permissions',
  createActionTemplate: 'Create Action Template',
  updateActionTemplate: 'Update Action Template',
  deleteActionTemplate: 'Delete Action Template',
  addRole: 'Add Role',
  updateRole: 'Update Role',
  removeRole: 'Delete Role',
  requestActionRun: 'Request Action Run',
  addCollaborator: 'Add Collaborator',
  removeCollaborator: 'Remove Collaborator',
  deleteRole: 'Delete Role'
}

export const formNames = {
  account: ACCOUNT_FORM_NAME,
  signup: SIGNUP_FORM_NAME,
  login: LOGIN_FORM_NAME,
  newEnvironment: 'newEnvironment',
  newActionTemplate: 'newActionTemplate',
  actionTemplate: 'actionTemplate',
  actionRunner: 'actionRunner',
  projectPermissions: 'projectPermissions',
  projectRoles: 'projectRoles',
  newRole: 'newRole'
}

export const paths = {
  list: LIST_PATH,
  account: ACCOUNT_PATH,
  login: LOGIN_PATH,
  signup: SIGNUP_PATH,
  actionTemplates: ACTION_TEMPLATES_PATH,
  projectActions: PROJECT_ACTION_PATH,
  projectEnvironments: PROJECT_ENVIRONMENTS_PATH,
  projectEvents: PROJECT_EVENTS_PATH,
  projectBucketConfig: PROJECT_BUCKET_CONFIG_PATH,
  projectPermissions: PERMISSIONS_PATH
}

export const firebasePaths = {
  actions: 'actions',
  actionTemplates: 'actionTemplates',
  actionRunnerRequests: 'requests/actionRunner',
  actionRunnerResponses: 'responses/actionRunner'
}

export const defaultRoles = {
  owner: {
    name: 'Owner',
    permissions: {
      read: {
        environments: true,
        members: true,
        permissions: true,
        roles: true
      },
      update: {
        environments: true,
        members: true,
        permissions: true,
        roles: true
      },
      delete: {
        environments: true,
        members: true,
        permissions: true,
        roles: true
      },
      create: {
        environments: true,
        members: true,
        permissions: true,
        roles: true
      }
    }
  },
  editor: {
    name: 'Editor',
    permissions: {
      read: { environments: true },
      update: { environments: true },
      create: { environments: true }
    }
  },
  viewer: {
    permissions: { read: { environments: true } }
  }
}

export default { ...paths, ...formNames }
