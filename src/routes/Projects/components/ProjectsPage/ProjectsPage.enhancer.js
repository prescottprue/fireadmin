import { compose } from 'redux'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { withHandlers, withStateHandlers } from 'recompose'
import { firestoreConnect } from 'react-redux-firebase'
import { LIST_PATH } from 'constants'
import { withNotifications } from 'modules/notification'
import { withRouter, spinnerWhileLoading } from 'utils/components'

export default compose(
  firestoreConnect(({ params, auth }) => [
    {
      collection: 'projects'
    }
  ]),
  connect(({ firestore: { ordered }, firebase }, { params }) => ({
    projects: ordered.projects,
    uid: get(firebase, 'auth.uid')
  })),
  spinnerWhileLoading(['projects']),
  withRouter,
  withNotifications,
  withStateHandlers(
    ({ initialDialogOpen = false }) => ({
      newDialogOpen: initialDialogOpen
    }),
    {
      toggleDialogWithData: ({ newDialogOpen }) => action => ({
        newDialogOpen: !newDialogOpen,
        selectedInstance: action
      }),
      toggleDialog: ({ newDialogOpen }) => () => ({
        newDialogOpen: !newDialogOpen
      })
    }
  ),
  withHandlers({
    addProject: ({ firestore, uid, showError }) => newInstance => {
      if (!uid) {
        return showError('You must be logged in to create a project')
      }
      firestore
        .add({ collection: 'projects' }, { ...newInstance, createdBy: uid })
        .then(res => showError('Project added successfully'))
        .catch(err =>
          showError('Error: ', err.message || 'Could not add project')
        )
    },
    deleteProject: ({ firestore, showError }) => projectId => {
      firestore
        .delete({ collection: 'projects', doc: projectId })
        .then(res => showError('Project deleted successfully'))
        .catch(err =>
          showError('Error: ', err.message || 'Could not add project')
        )
    },
    goToProject: ({ router }) => projectId => {
      router.push(`${LIST_PATH}/${projectId}`)
    },
    goToCollaborator: ({ router, showError }) => userId => {
      showError('User pages are not yet supported!')
      // router.push(`${USERS_PATH}/${userId}`)
    }
  })
)
