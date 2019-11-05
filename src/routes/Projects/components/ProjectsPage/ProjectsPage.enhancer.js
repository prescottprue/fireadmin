import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers, withStateHandlers, setDisplayName } from 'recompose'
import { withRouter } from 'react-router-dom'
import firestoreConnect from 'react-redux-firebase/lib/firestoreConnect'
import { withNotifications } from 'modules/notification'
import { spinnerWhileLoading } from 'utils/components'
import { UserIsAuthenticated } from 'utils/router'
import { getAllCurrentUsersProjects } from 'selectors'
import * as handlers from './ProjectsPage.handlers'

export default compose(
  // Set component display name (more clear in dev/error tools)
  setDisplayName('EnhancedProjectsPage'),
  // redirect to /login if user is not logged in
  UserIsAuthenticated,
  // Map auth uid from state to props
  connect(({ firebase: { auth: { uid } } }) => ({ uid })),
  // Wait for uid to exist before going further
  spinnerWhileLoading(['uid']),
  // Create listeners based on current users UID
  firestoreConnect(({ uid }) => [
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
    }
  ]),
  // Map projects from state to props
  connect((state, props) => ({
    projects: getAllCurrentUsersProjects(state, props)
  })),
  // Show loading spinner while projects and collabProjects are loading
  spinnerWhileLoading(['projects']),
  // Add props.router
  withRouter,
  // Add props.showError and props.showSuccess
  withNotifications,
  // Add state and state handlers as props
  withStateHandlers(
    // Setup initial state
    ({ initialDialogOpen = false }) => ({
      newDialogOpen: initialDialogOpen
    }),
    // Add state handlers as props
    {
      toggleDialog: ({ newDialogOpen }) => () => ({
        newDialogOpen: !newDialogOpen
      })
    }
  ),
  // Add handlers as props
  withHandlers(handlers)
)
