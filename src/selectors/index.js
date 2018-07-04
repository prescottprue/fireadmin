import { get, map, mapValues, mapKeys } from 'lodash'
import { createSelector } from 'reselect'

export const getAuthUid = (state, props) => get(state, 'firebase.auth.uid')

export const getProject = (state, props) =>
  get(state, `firestore.data.projects.${props.projectId}`)

export const getRoles = createSelector(
  getProject,
  project => (project === null ? null : get(project, 'roles'))
)

export const getCollaboratorPermissions = createSelector(
  getProject,
  project => (project === null ? null : get(project, 'collaboratorPermissions'))
)

export const getCollaboratorRoles = createSelector(
  getCollaboratorPermissions,
  collabatorPermissions => mapValues(collabatorPermissions, 'role')
)

export const getCurrentUserRole = createSelector(
  [getProject, getAuthUid],
  (project, authUid) => {
    return project === null
      ? null
      : get(project, `collaboratorPermissions.${authUid}.role`)
  }
)

export const currentUserPermissions = createSelector(
  [getRoles, getCurrentUserRole],
  (roles, currentUserRole) => get(roles, currentUserRole)
)

export const currentUserPermissionsByType = createSelector(
  [currentUserPermissions],
  permissions =>
    mapKeys(permissions, (_, permissionName) =>
      permissionName.replace('Permissions', '')
    )
)

export const getRoleOptions = createSelector(getRoles, roles =>
  map(roles, (_, value) => ({ value }))
)
