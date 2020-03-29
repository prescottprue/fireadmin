import { get } from 'lodash'
import { initSegment } from './analytics'
import { init as initErrorHandler } from './errorHandler'
import { currentUserProjectPermissions } from 'selectors'

/**
 * Initialize global scripts including analytics and error handling
 */
export function initScripts() {
  initErrorHandler()
  initSegment()
}

export function databaseURLToProjectName(databaseURL) {
  return databaseURL.replace('https://', '').replace('.firebaseio.com', '')
}

export function createPermissionChecker(state, props) {
  return (permission) => {
    const permissionsByType = currentUserProjectPermissions(state, props)
    return get(permissionsByType, permission) === true
  }
}
