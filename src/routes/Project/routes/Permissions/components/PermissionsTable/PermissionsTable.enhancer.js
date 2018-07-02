import { get, map, reduce, omit } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withProps, withHandlers } from 'recompose'
import { firebaseConnect, withFirestore } from 'react-redux-firebase'
import { withNotifications } from 'modules/notification'
import { spinnerWhileLoading, renderWhileEmpty } from 'utils/components'
import { to } from 'utils/async'
import NoCollaboratorsFound from './NoCollaboratorsFound'

export default compose(
  withNotifications,
  firebaseConnect(['displayNames']),
  withFirestore,
  // Map redux state to props
  connect(({ firebase: { auth, data }, firestore }, { projectId }) => ({
    auth,
    displayNames: data.displayNames,
    project: get(firestore, `data.projects.${projectId}`)
  })),
  // Show loading spinner until project and displayNames load
  spinnerWhileLoading(['project', 'displayNames']),
  withProps(({ project, displayNames }) => {
    const collaborators = map(project.collaborators, (_, uid) => ({
      uid,
      role: get(project, `collaboratorPermissions.${uid}.role`),
      displayName: get(displayNames, uid)
    }))
    return {
      // map collaboratorPermissions object into an object with displayName
      collaborators
    }
  }),
  renderWhileEmpty(['collaborators'], NoCollaboratorsFound),
  withHandlers({
    updatePermissions: ({
      showError,
      showSuccess,
      firestore,
      project,
      projectId
    }) => async values => {
      const currentPermissions = get(project, `collaboratorPermissions`)
      const collaboratorPermissions = reduce(
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
          collaboratorPermissions
        })
      )
      if (err) {
        showError(
          `Error updating permissions: ${err.message || 'Internal Error'}`
        )
        console.error(`Error updating permissions: ${err.message}`, err) // eslint-disable-line no-console
        throw err
      }
      showSuccess('Permissions updated successfully')
    },
    removeMember: ({
      showError,
      showSuccess,
      firestore,
      project,
      projectId
    }) => async uid => {
      const currentPermissions = get(project, `collaboratorPermissions`)
      const collaboratorPermissions = omit(currentPermissions, [uid])
      const currentCollaborators = get(project, `collaborators`)
      const collaborators = omit(currentCollaborators, [uid])
      const [err] = await to(
        firestore.update(`projects/${projectId}`, {
          collaboratorPermissions,
          collaborators
        })
      )
      if (err) {
        showError(`Error removing member: ${err.message || 'Internal Error'}`)
        console.error(`Error removing member: ${err.message}`, err) // eslint-disable-line no-console
        throw err
      }
      showSuccess('Member removed successfully')
    }
  })
)
