import { get, map } from 'lodash'
import { createSelector } from 'reselect'

export const getProject = (state, props) =>
  get(state, `firestore.data.projects.${props.projectId}`)

export const getRoles = createSelector(
  getProject,
  project => (project === null ? null : get(project, 'roles'))
)

export const getRoleOptions = createSelector(getRoles, roles =>
  map(roles, (_, value) => ({ value }))
)
