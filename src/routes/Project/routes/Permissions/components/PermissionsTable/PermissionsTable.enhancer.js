import { get, map, reduce } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withProps, withHandlers } from 'recompose'
import { reduxForm } from 'redux-form'
import { firebaseConnect, withFirestore } from 'react-redux-firebase'
import { withNotifications } from 'modules/notification'
import { spinnerWhileLoading, renderWhileEmpty } from 'utils/components'
import NoCollaboratorsFound from './NoCollaboratorsFound'
import { formNames } from 'constants'

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
      permission: get(project, `collaboratorPermissions.${uid}.permission`),
      displayName: get(displayNames, uid)
    }))
    return {
      // map collaboratorPermissions object into an object with displayName
      collaborators
    }
  }),
  renderWhileEmpty(['collaborators'], NoCollaboratorsFound),
  withHandlers({
    onSubmit: ({ firestore, project, projectId }) => async values => {
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
      await firestore.update(`projects/${projectId}`, {
        collaboratorPermissions
      })
    }
  }),
  reduxForm({ form: formNames.projectPermissions })
)
