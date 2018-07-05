import { get, map, mapKeys } from 'lodash'
import { createSelector } from 'reselect'

/**
 * Get the currently logged in user's Auth UID from firebase state. Data is
 * placed into redux state by react-redux-firebase on firebase auth state
 * changes.
 * @param  {Object} state - redux state
 * @param  {Object} props - component props
 * @return {String} Current logged in user's UID
 */
export const getAuthUid = state => get(state, 'firebase.auth.uid')

/**
 * Get project from redux state using projectId prop.
 * @param  {Object} state - redux state
 * @param  {Object} props - component props
 * @return {Object} Project data object from redux state
 */
export const getProject = (state, props) =>
  get(state, `firestore.data.projects.${props.projectId}`)

/**
 * Get whether or not the currently logged in user is the project owner
 * @param  {Object} state - redux state
 * @param  {Object} props - component props
 */
export const getCurrentUserCreatedProject = createSelector(
  [getProject, getAuthUid],
  (project, authUid) => get(project, 'createdBy') === authUid
)

/**
 * Get roles from project
 * @param  {Object} state - redux state
 * @param  {Object} props - component props
 */
export const getRoles = createSelector(
  getProject,
  project => (project === null ? null : get(project, 'roles'))
)

/**
 * Get logged in user's role from project (under collabatorPermissions
 * parameter stored by user's UID)
 * @param  {Object} state - redux state
 * @param  {Object} props - component props
 * @return {String} Current user's role name
 */
export const getCurrentUserRoleName = createSelector(
  [getProject, getAuthUid],
  (project, authUid) => {
    return project === null
      ? null
      : get(project, `collaboratorPermissions.${authUid}.role`)
  }
)

/**
 * Get logged in user's permissions from project by getting roles then selecting
 * the user's role (under collabatorPermissions parameter stored by user's UID)
 * @param  {Object} state - redux state
 * @param  {Object} props - component props
 * @return {Object}       [description]
 */
export const currentUserPermissions = createSelector(
  [getRoles, getCurrentUserRoleName],
  (roles, currentUserRole) => get(roles, currentUserRole)
)

/**
 * Get logged in user's permissions from project and group them by type
 * (i.e. create, read, update, destroy)
 * @param  {Object} state - redux state
 * @param  {Object} props - component props
 * @return {Object} User permissions by permission type
 */
export const currentUserPermissionsByType = createSelector(
  [currentUserPermissions],
  permissions =>
    mapKeys(permissions, (_, permissionName) =>
      permissionName.replace('Permissions', '')
    )
)

/**
 * Get options for roles from roles parameter of project (for use within select
 * dropdown)
 * @param  {Object} state - redux state
 * @param  {Object} props - component props
 * @return {Array<string>} Role option strings
 */
export const getRoleOptions = createSelector(getRoles, roles =>
  map(roles, (_, value) => ({ value }))
)
