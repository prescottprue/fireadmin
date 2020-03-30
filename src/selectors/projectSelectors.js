import { get, map, size, orderBy, groupBy } from 'lodash'
import { createSelector } from 'reselect'
import { formatDate } from 'utils/formatters'
import { isLoaded } from 'react-redux-firebase/lib/helpers'

/**
 * Get the currently logged in user's Auth UID from firebase state. Data is
 * placed into redux state by react-redux-firebase on firebase auth state
 * changes.
 * @param {object} state - redux state
 * @param {object} props - component props
 * @returns {String} Current logged in user's UID
 */
export function getAuthUid(state) {
  return get(state, 'firebase.auth.uid')
}

/**
 * Get project from redux state using projectId prop.
 * @param {object} state - redux state
 * @param {object} props - component props
 * @returns {object} Project data object from redux state
 */
export function getProject(state, props) {
  return get(state, `firestore.data.projects.${props.projectId}`)
}

/**
 * Get project from redux state using projectId prop.
 * @param {object} state - redux state
 * @param {object} props - component props
 * @returns {object} Project data object from redux state
 */
export function getDisplayNames(state, props) {
  return get(state, 'firebase.data.displayNames')
}

/**
 * Get project from redux state using projectId prop.
 * @param  {object} state - redux state
 * @param  {object} props - component props
 * @return {object} Project data object from redux state
 */
function getProjectEvents(state, props) {
  if (!props.projectId) {
    console.error('props.projectId not set in getProjectEvents selector') // eslint-disable-line no-console
  }
  return get(state, `firestore.data.projectEvents-${props.projectId}`)
}

/**
 * Get whether or not the currently logged in user is the project owner
 * @param  {object} state - redux state
 * @param  {object} props - component props
 */
export const getCurrentUserCreatedProject = createSelector(
  [getProject, getAuthUid],
  (project, authUid) => get(project, 'createdBy') === authUid
)

/**
 * Get roles from project
 * @param  {object} state - redux state
 * @param  {object} props - component props
 */
export const getRoles = createSelector(getProject, (project) =>
  project === null ? null : get(project, 'roles')
)

/**
 * Get roles from project
 * @param {object} state - redux state
 * @param {object} props - component props
 */
export const getOrderedRoles = createSelector(getRoles, (roles) =>
  orderBy(
    map(roles, (role, key) => ({ ...role, key })),
    [(role) => size(get(role, 'permissions'))],
    ['desc']
  )
)

/**
 * Get roles from project
 * @param {object} state - redux state
 * @param {object} props - component props
 */
export const getProjectPermissions = createSelector(getProject, (project) =>
  project === null ? null : get(project, 'permissions')
)

/**
 * Get roles from project
 * @param {object} state - redux state
 * @param {object} props - component props
 */
export const getPopulatedProjectPermissions = createSelector(
  [getRoles, getDisplayNames, getProjectPermissions],
  (roles, displayNames, unpopulatedPermissions) => {
    return map(unpopulatedPermissions, (permission, uid) => ({
      ...permission,
      uid,
      displayName: get(displayNames, uid),
      roleName: get(roles, permission.role)
    }))
  }
)

/**
 * Get project's events grouped by date
 * @param {object} state - redux state
 * @param {object} props - component props
 */
export const getProjectEventsGroupedByDate = createSelector(
  [getProjectEvents, getDisplayNames],
  (projectEvents, displayNames) => {
    if (!isLoaded(projectEvents)) {
      return projectEvents
    }
    const events = map(projectEvents, (event) => {
      const createdBy = get(event, 'createdBy')
      if (createdBy) {
        return {
          ...event,
          createdBy: get(displayNames, createdBy, createdBy)
        }
      }
      return event
    })
    return groupBy(events, (event) => {
      const createdAt = get(event, 'createdAt')
      return formatDate(createdAt.toDate ? createdAt.toDate() : createdAt)
    })
  }
)

/**
 * Get logged in user's role from project (under collabatorPermissions
 * parameter stored by user's UID)
 * @param {object} state - redux state
 * @param {object} props - component props
 * @returns {string} Current user's role name
 */
export const getCurrentUserRoleName = createSelector(
  [getProject, getAuthUid],
  (project, authUid) => {
    return project === null ? null : get(project, `permissions.${authUid}.role`)
  }
)

/**
 * Get logged in user's permissions from project by getting roles then selecting
 * the user's role (under collabatorPermissions parameter stored by user's UID)
 * @param {object} state - redux state
 * @param {object} props - component props
 * @return {object} User's project permissions
 */
export const currentUserProjectPermissions = createSelector(
  [getRoles, getCurrentUserRoleName],
  (roles, currentUserRole) => get(roles, `${currentUserRole}.permissions`)
)

/**
 * Get options for roles from roles parameter of project (for use within select
 * dropdown)
 * @param {object} state - redux state
 * @param {object} props - component props
 * @return {Array<string>} Role option strings
 */
export const getRoleOptions = createSelector(getRoles, (roles) =>
  map(roles, ({ name }, value) => ({ value, name }))
)
