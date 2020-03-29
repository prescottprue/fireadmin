import { get, reduce, omit } from 'lodash'
import { to } from 'utils/async'
import { triggerAnalyticsEvent } from 'utils/analytics'

export function updatePermissions({
  showError,
  showSuccess,
  firestore,
  project,
  projectId
}) {
  return async (values) => {
    const currentPermissions = get(project, `permissions`)
    const permissions = reduce(
      currentPermissions,
      (acc, userPermissionSetting, settingUid) => {
        return {
          ...acc,
          [settingUid]: values[settingUid]
            ? {
                ...userPermissionSetting,
                ...values[settingUid],
                updatedAt: firestore.FieldValue.serverTimestamp()
              }
            : userPermissionSetting
        }
      },
      {}
    )
    const [err] = await to(
      firestore.update(`projects/${projectId}`, {
        permissions
      })
    )
    if (err) {
      showError(
        `Error updating permissions: ${err.message || 'Internal Error'}`
      )
      console.error(`Error updating permissions: ${err.message}`, err) // eslint-disable-line no-console
      throw err
    }
    triggerAnalyticsEvent('updateRole', { projectId })
    showSuccess('Permissions updated successfully')
  }
}

export function removeMember({
  showError,
  showSuccess,
  firestore,
  project,
  projectId
}) {
  return async (uid) => {
    const currentPermissions = get(project, 'permissions')
    const permissions = omit(currentPermissions, [uid])
    const currentCollaborators = get(project, 'collaborators')
    const collaborators = omit(currentCollaborators, [uid])
    const [err] = await to(
      firestore.update(`projects/${projectId}`, {
        permissions,
        collaborators
      })
    )
    if (err) {
      showError(`Error removing member: ${err.message || 'Internal Error'}`)
      console.error(`Error removing member: ${err.message}`, err) // eslint-disable-line no-console
      throw err
    }
    triggerAnalyticsEvent('removeCollaborator', {
      projectId,
      removedCollaboratorUid: uid
    })
    showSuccess('Member removed successfully')
  }
}
