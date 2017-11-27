import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, map } from 'lodash'
import { withHandlers, withStateHandlers } from 'recompose'
import { firestoreConnect } from 'react-redux-firebase'
import { LIST_PATH } from 'constants'
import { withNotifications } from 'modules/notification'
import { withRouter, spinnerWhileLoading } from 'utils/components'

// TODO: Do this using populate instead
const populateProjects = ({ ordered, data }) => {
  if (!get(ordered, 'projects') && !get(data, 'users')) {
    return undefined
  }
  return map(ordered.projects, project => ({
    ...project,
    createdBy: get(data.users, project.createdBy)
  }))
}

export default compose(
  firestoreConnect(({ params, auth }) => [
    {
      collection: 'projects'
    },
    {
      collection: 'users' // TODO: Load this data through populate instead
    }
  ]),
  connect(
    ({ firestore, firestore: { ordered, data }, firebase }, { params }) => ({
      projects: populateProjects({ ordered, data }),
      uid: get(firebase, 'auth.uid')
    })
  ),
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
    addProject: ({ firestore, uid, showError, showSuccess }) => newInstance => {
      if (!uid) {
        return showError('You must be logged in to create a project')
      }
      firestore
        .add({ collection: 'projects' }, { ...newInstance, createdBy: uid })
        .then(res => showSuccess('Project added successfully'))
        .catch(err =>
          showError('Error: ', err.message || 'Could not add project')
        )
    },
    deleteProject: ({ firestore, showError, showSuccess }) => projectId => {
      firestore
        .delete({ collection: 'projects', doc: projectId })
        .then(res => showSuccess('Project deleted successfully'))
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
