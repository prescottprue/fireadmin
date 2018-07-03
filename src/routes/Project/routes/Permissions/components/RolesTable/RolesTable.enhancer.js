import { get, some } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers, withStateHandlers, withProps } from 'recompose'
import { withFirestore } from 'react-redux-firebase'
import { withNotifications } from 'modules/notification'
import { spinnerWhileLoading, renderWhileEmpty } from 'utils/components'
import NoRolesFound from './NoRolesFound'

export default compose(
  withNotifications,
  withFirestore,
  // Map redux state to props
  connect(({ firebase: { auth, data }, firestore }, { projectId }) => ({
    auth,
    project: get(firestore, `data.projects.${projectId}`),
    roles: get(firestore, `data.projects.${projectId}.roles`),
    initialValues: get(firestore, `data.projects.${projectId}.roles`)
  })),
  // Show loading spinner until project and displayNames load
  spinnerWhileLoading(['project']),
  renderWhileEmpty(['roles'], NoRolesFound),
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
    updateRole: ({
      firestore,
      project,
      projectId,
      showSuccess,
      roleKey
    }) => async newRoles => {
      const currentRoles = get(project, `roles`)
      await firestore.update(`projects/${projectId}`, {
        roles: {
          ...currentRoles,
          ...newRoles
        }
      })
      showSuccess('Roles updated successfully!')
    },
    addRole: props => async newRole => {
      const { firestore, project, projectId } = props
      const currentRoles = get(project, `roles`)
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
      props.closeNewRole()
      props.showSuccess('Roles updated successfully!')
    }
  }),
  withProps(({ newRoleOpen, auth }) => ({
    addRoleDisabled: newRoleOpen || !auth.uid
  }))
)
