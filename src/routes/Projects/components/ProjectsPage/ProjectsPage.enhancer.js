import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, map } from 'lodash'
import { withHandlers, withStateHandlers, pure } from 'recompose'
import { firestoreConnect } from 'react-redux-firebase'
import { withNotifications } from 'modules/notification'
import { withRouter, spinnerWhileLoading } from 'utils/components'
import { UserIsAuthenticated } from 'utils/router'
import * as handlers from './ProjectsPage.handlers'

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
  // Show loading spinner while projects and collabProjects are loading
  spinnerWhileLoading(['projects', 'collabProjects']),
  // Add props.router
  withRouter,
  // Add props.showError and props.showSuccess
  withNotifications,
  // Add state and state handlers as props
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
  withHandlers(handlers),
  pure // shallow equals comparison on props (prevent unessesary re-renders)
)
