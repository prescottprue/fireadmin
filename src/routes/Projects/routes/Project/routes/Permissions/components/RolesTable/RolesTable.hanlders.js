import { get, some, omit } from 'lodash'
import { triggerAnalyticsEvent, createProjectEvent } from 'utils/analytics'

export function updateRole({
  firestore,
  project,
  projectId,
  uid,
  showSuccess
}) {
  return async (roleUpdates, dispatch, formProps) => {
    const currentRoles = get(project, 'roles', {})
    await firestore.update(`projects/${projectId}`, {
      roles: {
        ...currentRoles,
        [formProps.roleKey]: {
          ...get(currentRoles, formProps.roleKey, {}),
          permissions: roleUpdates
        }
      }
    })
    // Write event to project events
    await createProjectEvent(
      { projectId, firestore },
      {
        eventType: 'updateRole',
        eventData: { roleKey: formProps.roleKey },
        createdBy: uid
      }
    )
    showSuccess('Role updated successfully!')
    triggerAnalyticsEvent('updateRole', {
      projectId,
      roleName: formProps.roleKey
    })
  }
}

export function addRole(props) {
  return async (newRole) => {
    const { firestore, project, projectId, uid } = props
    const currentRoles = get(project, `roles`, {})
    if (some(currentRoles, { name: newRole.name })) {
      const existsErrMsg = 'Role with that name already exists'
      props.showError(existsErrMsg)
      throw new Error(existsErrMsg)
    }
    await firestore.update(`projects/${projectId}`, {
      roles: {
        ...currentRoles,
        [newRole.name]: {
          editPermissions: true
        }
      }
    })
    // Write event to project events
    await createProjectEvent(
      { projectId, firestore },
      {
        eventType: 'addRole',
        eventData: { roleKey: newRole.name },
        createdBy: uid
      }
    )
    props.showSuccess('New Role added successfully!')
    triggerAnalyticsEvent('addRole', { projectId })
    props.closeNewRole()
  }
}

export function deleteRole({
  firestore,
  uid,
  project: { roles },
  projectId,
  showSuccess
}) {
  return async (roleKey) => {
    await firestore.update(`projects/${projectId}`, {
      roles: omit(roles, [roleKey])
    })
    // Write event to project events
    await createProjectEvent(
      { projectId, firestore },
      {
        eventType: 'deleteRole',
        eventData: { roleKey: roleKey },
        createdBy: uid
      }
    )
    showSuccess('Role deleted successfully!')
    triggerAnalyticsEvent('deleteRole', { projectId, roleKey })
  }
}
