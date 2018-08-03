import { get, some, omit } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers, withStateHandlers, withProps } from 'recompose'
import { withFirestore } from 'react-redux-firebase'
import { withNotifications } from 'modules/notification'
import { spinnerWhileLoading } from 'utils/components'
import { triggerAnalyticsEvent } from 'utils/analytics'
import { getOrderedRoles, getProject } from 'selectors'

export default compose(
  withNotifications,
  withFirestore,
  // Map redux state to props
  connect((state, props) => ({
    project: getProject(state, props),
    orderedRoles: getOrderedRoles(state, props)
  })),
  // Show loading spinner until project and displayNames load
  spinnerWhileLoading(['project']),
  withStateHandlers(
    () => ({
      newRoleOpen: false
    }),
    {
      openNewRole: () => () => ({
        newRoleOpen: true
      }),
      closeNewRole: () => () => ({
        newRoleOpen: false
      })
    }
  ),
  withHandlers({
    updateRole: ({ firestore, project, projectId, showSuccess }) => async (
      roleUpdates,
      dispatch,
      formProps
    ) => {
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
      showSuccess('Role updated successfully!')
      triggerAnalyticsEvent('updateRole', {
        projectId,
        roleName: formProps.roleKey
      })
    },
    addRole: props => async newRole => {
      const { firestore, project, projectId } = props
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
      props.showSuccess('New Role added successfully!')
      triggerAnalyticsEvent('addRole', { projectId })
      props.closeNewRole()
    },
    deleteRole: ({
      firestore,
      project: { roles },
      projectId,
      showSuccess
    }) => async roleKey => {
      await firestore.update(`projects/${projectId}`, {
        roles: omit(roles, [roleKey])
      })
      showSuccess('Role deleted successfully!')
      triggerAnalyticsEvent('deleteRole', { projectId, roleKey })
    }
  }),
  withProps(({ newRoleOpen, auth }) => ({
    addRoleDisabled: newRoleOpen
  }))
)
