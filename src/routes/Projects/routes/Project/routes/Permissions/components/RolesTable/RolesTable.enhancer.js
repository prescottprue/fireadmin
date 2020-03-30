import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers } from 'recompose'
import withFirestore from 'react-redux-firebase/lib/withFirestore'
import { withNotifications } from 'modules/notification'
import { spinnerWhileLoading } from 'utils/components'
import { getOrderedRoles, getProject, getAuthUid } from 'selectors'
import * as handlers from './RolesTable.hanlders'

export default compose(
  withNotifications,
  withFirestore,
  // Map redux state to props
  connect((state, props) => ({
    uid: getAuthUid(state, props),
    project: getProject(state, props),
    orderedRoles: getOrderedRoles(state, props)
  })),
  // Show loading spinner until project and displayNames load
  spinnerWhileLoading(['project']),
  withHandlers(handlers)
)
