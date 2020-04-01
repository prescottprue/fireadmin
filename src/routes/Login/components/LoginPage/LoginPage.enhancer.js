import withFirebase from 'react-redux-firebase/lib/withFirebase'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import { UserIsNotAuthenticated } from 'utils/router'

export default compose(
  // redirect to /projects if user is already authed
  UserIsNotAuthenticated,
  // Add props.firebase (used in handlers)
  withFirebase,
  withRouter
)
