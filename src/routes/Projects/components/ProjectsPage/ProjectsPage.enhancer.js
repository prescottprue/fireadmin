import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, map } from 'lodash'
import { withHandlers, withStateHandlers, pure } from 'recompose'
import { firestoreConnect } from 'react-redux-firebase'
import { LIST_PATH } from 'constants'
import { withNotifications } from 'modules/notification'
import { withRouter, spinnerWhileLoading, logProps } from 'utils/components'
import { UserIsAuthenticated } from 'utils/router'

// TODO: Do this using populate instead once it is supported
const populateUsers = (path, { ordered, data }) => {
  if (!get(ordered, path, get(data, path)) && !get(data, 'users')) {
    return undefined
  }
  return map(get(ordered, path, get(data, path)), project => ({
    ...project,
    createdBy: get(data.users, project.createdBy)
  }))
}

export default compose(
  // redirect to /login if user is not logged in
  UserIsAuthenticated,
  // Map auth uid from state to props
  connect(({ firebase: { auth: { uid } } }) => ({ uid })),
  // Wait for uid to exist before going further
  spinnerWhileLoading(['uid']),
  // Create listeners based on current users UID
  firestoreConnect(({ params, uid }) => [
    // Listener for projects the current user created
    {
      collection: 'projects',
      where: ['createdBy', '==', uid]
    },
    // Listener for projects current user collaborates on
    {
      collection: 'projects',
      where: [`collaborators.${uid}`, '==', true],
      storeAs: 'collabProjects'
    },
    // Listener for all users
    // TODO: Load this data through populate instead
    {
      collection: 'users'
    }
  ]),
  // Map projects from state to props (populating them in the process)
  connect(({ firestore: { ordered, data } }) => ({
    projects: populateUsers('projects', { ordered, data }),
    collabProjects: populateUsers('collabProjects', { ordered, data })
  })),
  spinnerWhileLoading(['projects', 'collabProjects']),
  logProps(['project', 'collabProjects']),
  withRouter, // add props.router
  withNotifications, // add props.showError and props.showSuccess
  withStateHandlers(
    // Setup initial state
    ({ initialDialogOpen = false }) => ({ newDialogOpen: initialDialogOpen }),
    // Add state handlers as props
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
  // Add other handlers as props
  withHandlers({
    addProject: props => async newInstance => {
      const { firestore, firebase, uid, showError, showSuccess } = props
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
    deleteProject: props => async projectId => {
      const { firestore, showError, showSuccess } = props
      try {
        await firestore.delete({ collection: 'projects', doc: projectId })
        showSuccess('Project deleted successfully')
      } catch (err) {
        console.error('Error:', err) // eslint-disable-line no-console
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
  }),
  pure // shallow equals comparison on props (prevent unessesary re-renders)
)
