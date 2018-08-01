import { get, isUndefined, isArray } from 'lodash'
import { createSelector } from 'reselect'

export function getProjectsOwnedByCurrentUser(state) {
  return get(state, 'firestore.ordered.projects')
}
export function getCollabProjects(state) {
  return get(state, 'firestore.ordered.collabProjects')
}

export const getAllCurrentUsersProjects = createSelector(
  [getProjectsOwnedByCurrentUser, getCollabProjects],
  (ownedProjects, collabProjects) => {
    // One of the two is still loading
    if (isUndefined(ownedProjects) || isUndefined(collabProjects)) {
      return undefined
    }
    if (isArray(ownedProjects) && isArray(collabProjects)) {
      return ownedProjects.concat(collabProjects)
    }
    return null
  }
)
