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
  connect(({ firebase: { auth: { uid } } }) => ({ uid })),
  spinnerWhileLoading(['uid']),
  firestoreConnect(({ params, uid }) => [
    {
      collection: 'projects',
      where: ['createdBy', '==', uid]
    },
    {
      collection: 'users' // TODO: Load this data through populate instead
    }
  ]),
  connect(({ firestore: { ordered, data } }) => ({
    projects: populateProjects({ ordered, data })
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
    addProject: ({
      firestore,
      firebase,
      uid,
      showError,
      showSuccess
    }) => async newInstance => {
      if (!uid) {
        return showError('You must be logged in to create a project')
      }
      try {
        const res = await firestore.add(
          { collection: 'projects' },
          {
            ...newInstance,
            createdBy: uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          }
        )
        showSuccess('Project added successfully')
        return res
      } catch (err) {
        showError(err.message || 'Could not add project')
        throw err
      }
    },
    deleteProject: ({
      firestore,
      showError,
      showSuccess
    }) => async projectId => {
      try {
        await firestore.delete({ collection: 'projects', doc: projectId })
        showSuccess('Project deleted successfully')
      } catch (err) {
        console.error('Error:', err) // eslint-disable-line
        showError(err.message || 'Could not add project')
      }
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
