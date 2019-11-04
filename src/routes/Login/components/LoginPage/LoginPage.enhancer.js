import withFirebase from 'react-redux-firebase/lib/withFirebase'
import { compose, setDisplayName } from 'recompose'
import { withRouter } from 'react-router-dom'
import { UserIsNotAuthenticated } from 'utils/router'
import { withNotifications } from 'modules/notification'

export default compose(
  // redirect to /projects if user is already authed
  UserIsNotAuthenticated,
  // add props.showError
  withNotifications,
  // Add props.firebase (used in handlers)
  withFirebase,
  withRouter,
  // Set component display name (more clear in dev/error tools)
  setDisplayName('EnhancedLoginPage')
)
