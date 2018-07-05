import { get } from 'lodash'
import { initGA } from './analytics'
import { init as initErrorHandler } from './errorHandler'
import { currentUserPermissionsByType } from 'selectors'

export const initScripts = () => {
  initGA()
  initErrorHandler()
}

export const databaseURLToProjectName = databaseURL =>
  databaseURL.replace('https://', '').replace('.firebaseio.com', '')

export const createPermissionChecker = (state, props) => permission => {
  const permissionsByType = currentUserPermissionsByType(state, props)
  return get(permissionsByType, permission) === true
}
