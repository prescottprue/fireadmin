import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers } from 'recompose'
import { reduxForm } from 'redux-form'
import { withFirestore } from 'react-redux-firebase'
import { withNotifications } from 'modules/notification'
import { spinnerWhileLoading, renderWhileEmpty } from 'utils/components'
import NoRolesFound from './NoRolesFound'
import { formNames } from 'constants'

export default compose(
  withNotifications,
  withFirestore,
  // Map redux state to props
  connect(({ firebase: { auth, data }, firestore }, { projectId }) => ({
    auth,
    project: get(firestore, `data.projects.${projectId}`),
    initialValues: get(firestore, `data.projects.${projectId}.roles`)
  })),
  // Show loading spinner until project and displayNames load
  spinnerWhileLoading(['project']),
  renderWhileEmpty(['roles'], NoRolesFound),
  withHandlers({
    onSubmit: ({
      firestore,
      project,
      projectId,
      showSuccess
    }) => async newRoles => {
      const currentRoles = get(project, `roles`)
      await firestore.update(`projects/${projectId}`, {
        roles: {
          ...currentRoles,
          ...newRoles
        }
      })
      showSuccess('Roles updated successfully!')
    }
  }),
  reduxForm({ form: formNames.projectRoles })
)
