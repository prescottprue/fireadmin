import { get } from 'lodash'

/**
 * Create a permission checking function based on projct and user
 * @param {Object} project - Project object
 * @param {Object} project.permissions - Project permissions object
 * @param {String} userUid - User's UID for permission check
 * @example <caption>Basic</caption>
 * const userHasPermission = createPermissionGetter(project, user.uid)
 * userHasPermission('update.roles') // true if user has role update permission
 */
export function createPermissionGetter(project, userUid) {
  const userRole = get(project, `permissions.${userUid}.role`)
  /**
   * Check if user has permission
   * @param {String} permission - Permission string
   * @example <caption>Check For Permission</caption>
   * userHasPermission('update.roles') // true if user has role update permission
   */
  return function userHasPermission(permission) {
    return get(project, `roles.${userRole}.permissions.${permission}`)
  }
}
