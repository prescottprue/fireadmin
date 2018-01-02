export const LIST_PATH = '/projects'
export const ACCOUNT_PATH = '/account'
export const LOGIN_PATH = '/login'
export const SIGNUP_PATH = '/signup'
export const DATA_MIGRATION_PATH = '/migration-templates'
export const NEW_MIGRATION_TEMPLATE_PATH = '/migrations'
export const PROJECT_MIGRATION_PATH = 'migrations'
export const PROJECT_ENVIRONMENTS_PATH = 'environments'
export const ACCOUNT_FORM_NAME = 'account'
export const LOGIN_FORM_NAME = 'login'
export const SIGNUP_FORM_NAME = 'signup'
export const NEW_PROJECT_FORM_NAME = 'newProject'

export const formNames = {
  account: ACCOUNT_FORM_NAME,
  signup: SIGNUP_FORM_NAME,
  login: LOGIN_FORM_NAME,
  newEnvironment: 'newEnvironment',
  newMigrationTemplate: 'newMigrationTemplate',
  migrationTemplate: 'migrationTemplate'
}

export const paths = {
  list: LIST_PATH,
  account: ACCOUNT_PATH,
  login: LOGIN_PATH,
  signup: SIGNUP_PATH,
  dataMigration: DATA_MIGRATION_PATH,
  projectDataMigration: PROJECT_MIGRATION_PATH,
  projectEnvironments: PROJECT_ENVIRONMENTS_PATH
}

export const firebasePaths = {
  migrations: 'migrations',
  migrationTemplates: 'migrationTemplates'
}

export default { ...paths, ...formNames }
