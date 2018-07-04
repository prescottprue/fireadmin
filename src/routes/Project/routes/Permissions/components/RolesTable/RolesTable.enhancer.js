import PropTypes from 'prop-types'
import { get, some, omit } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  withHandlers,
  withStateHandlers,
  withProps,
  setPropTypes
} from 'recompose'
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
  setPropTypes({
    roleKey: PropTypes.string.isRequired
  }),
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
      const currentRoles = get(project, `roles`)
      await firestore.update(`projects/${projectId}`, {
        roles: {
          ...currentRoles,
          [formProps.roleKey]: roleUpdates
        }
      })
      showSuccess('Role updated successfully!')
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
      props.closeNewRole()
      props.showSuccess('Roles added successfully!')
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
      showSuccess('Roles deleted successfully!')
    }
  }),
  withProps(({ newRoleOpen, auth }) => ({
    addRoleDisabled: newRoleOpen || !auth.uid
  }))
)
