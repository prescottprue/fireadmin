import { get, map, size, orderBy, groupBy, invoke } from 'lodash'
import { createSelector } from 'reselect'
import { formatDate } from 'utils/formatters'

/**
 * Get the currently logged in user's Auth UID from firebase state. Data is
 * placed into redux state by react-redux-firebase on firebase auth state
 * changes.
 * @param  {Object} state - redux state
 * @param  {Object} props - component props
 * @return {String} Current logged in user's UID
 */
export function getAuthUid(state) {
  return get(state, 'firebase.auth.uid')
}

/**
 * Get project from redux state using projectId prop.
 * @param  {Object} state - redux state
 * @param  {Object} props - component props
 * @return {Object} Project data object from redux state
 */
export function getProject(state, props) {
  return get(state, `firestore.data.projects.${props.projectId}`)
}

/**
 * Get project from redux state using projectId prop.
 * @param  {Object} state - redux state
 * @param  {Object} props - component props
 * @return {Object} Project data object from redux state
 */
export function getDisplayNames(state, props) {
  return get(state, `firebase.data.displayNames`)
}

/**
 * Get projectId from props (projectId or params.projectId)
 * @param  {Object} state - redux state
 * @param  {Object} props - component props
 * @return {Object} Project data object from redux state
 */
export function projectIdFromProps(state, props) {
  const projectId = get(props, 'projectId', get(props, 'params.projectId'))
  if (!projectId) {
    /* eslint-disable no-console */
    console.warn(
      'projectId not found in props passed to connect. Props:',
      props
    )
    /* eslint-enable no-console */
  }
  return projectId
}

/**
 * Get project from redux state using projectId prop.
 * @param  {Object} state - redux state
 * @param  {Object} props - component props
 * @return {Object} Project data object from redux state
 */
export function getProjectEvents(state, props) {
  return get(
    state,
    `firestore.data.projectEvents-${projectIdFromProps(state, props)}`
  )
}

/**
 * Get project from redux state using projectId prop.
 * @param  {Object} state - redux state
 * @param  {Object} props - component props
 * @return {Object} Project data object from redux state
 */
export function getOrderedProjectEvents(state, props) {
  return get(
    state,
    `firestore.ordered.projectEvents-${projectIdFromProps(state, props)}`
  )
}

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
 * Get roles from project
 * @param  {Object} state - redux state
 * @param  {Object} props - component props
 */
export const getOrderedRoles = createSelector(
  getRoles,
  roles =>
    orderBy(
      map(roles, (role, key) => ({ ...role, key })),
      [role => size(get(role, 'permissions'))],
      ['desc']
    )
)

/**
 * Get roles from project
 * @param  {Object} state - redux state
 * @param  {Object} props - component props
 */
export const getProjectPermissions = createSelector(
  getProject,
  project => (project === null ? null : get(project, 'permissions'))
)

/**
 * Get roles from project
 * @param  {Object} state - redux state
 * @param  {Object} props - component props
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
 * @param  {Object} state - redux state
 * @param  {Object} props - component props
 */
export const getProjectEventsGroupedByDate = createSelector(
  [getProjectEvents, getDisplayNames],
  (projectEvents, displayNames) => {
    const events = map(projectEvents, event => {
      const createdBy = get(event, 'createdBy')
      if (createdBy) {
        return {
          ...event,
          createdBy: get(displayNames, createdBy, createdBy)
        }
      }
      return event
    })
    if (displayNames && events) {
      return groupBy(events, event =>
        formatDate(invoke(get(event, 'createdAt'), 'toDate'))
      )
    }
  }
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
    return project === null ? null : get(project, `permissions.${authUid}.role`)
  }
)

/**
 * Get logged in user's permissions from project by getting roles then selecting
 * the user's role (under collabatorPermissions parameter stored by user's UID)
 * @param  {Object} state - redux state
 * @param  {Object} props - component props
 * @return {Object}       [description]
 */
export const currentUserProjectPermissions = createSelector(
  [getRoles, getCurrentUserRoleName],
  (roles, currentUserRole) => get(roles, `${currentUserRole}.permissions`)
)

/**
 * Get options for roles from roles parameter of project (for use within select
 * dropdown)
 * @param  {Object} state - redux state
 * @param  {Object} props - component props
 * @return {Array<string>} Role option strings
 */
export const getRoleOptions = createSelector(
  getRoles,
  roles => map(roles, ({ name }, value) => ({ value, name }))
)
