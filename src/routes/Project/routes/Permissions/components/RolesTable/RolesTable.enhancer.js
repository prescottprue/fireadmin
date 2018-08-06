import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers, withStateHandlers, withProps } from 'recompose'
import { withFirestore } from 'react-redux-firebase'
import { withNotifications } from 'modules/notification'
import { spinnerWhileLoading } from 'utils/components'
import { withStyles } from '@material-ui/core/styles'
import { getOrderedRoles, getProject, getAuthUid } from 'selectors'
import styles from './RolesTable.styles'
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
  withStateHandlers(
    () => ({
      newRoleOpen: false
    }),
    {
      openNewRole: () => () => ({
        newRoleOpen: true
      }),
      closeNewRole: () => () => ({
        newRoleOpen: false
      })
    }
  ),
  withHandlers(handlers),
  withProps(({ newRoleOpen, auth }) => ({
    addRoleDisabled: newRoleOpen
  })),
  withStyles(styles)
)
