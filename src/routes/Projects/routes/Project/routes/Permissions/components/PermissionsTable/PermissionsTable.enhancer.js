import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  withProps,
  withHandlers,
  withStateHandlers,
  setDisplayName
} from 'recompose'
import withFirestore from 'react-redux-firebase/lib/withFirestore'
import firebaseConnect from 'react-redux-firebase/lib/firebaseConnect'
import { withNotifications } from 'modules/notification'
import { withStyles } from '@material-ui/core/styles'
import { spinnerWhileLoading, renderWhileEmpty } from 'utils/components'
import {
  getPopulatedProjectPermissions,
  getDisplayNames,
  getProject
} from 'selectors'
import * as handlers from './PermissionsTable.handlers'
import NoPermissionsFound from './NoPermissionsFound'
import styles from './PermissionsTable.styles'

export default compose(
  setDisplayName('EnhancedPermissionsTable'),
  withNotifications,
  firebaseConnect(['displayNames']),
  withFirestore,
  // Map redux state to props
  connect((state, props) => ({
    // map permissions object into an object with displayName
    permissions: getPopulatedProjectPermissions(state, props),
    displayNames: getDisplayNames(state, props),
    project: getProject(state, props)
  })),
  // Show loading spinner until project and displayNames load
  spinnerWhileLoading(['project', 'displayNames']),
  withStateHandlers(
    () => ({
      anchorEl: null,
      deleteDialogOpen: false
    }),
    {
      handleMenuClick: () => (e) => ({
        anchorEl: e.target
      }),
      handleMenuClose: () => () => ({
        anchorEl: null
      }),
      startDelete: () => (selectedMemberId) => ({
        deleteDialogOpen: true,
        selectedMemberId: selectedMemberId
      }),
      handleDeleteClose: () => () => ({
        deleteDialogOpen: false
      })
    }
  ),
  withProps(({ project, displayNames, selectedMemberId }) => {
    return {
      // map permissions object into an object with displayName
      selectedMemberName: get(displayNames, selectedMemberId, selectedMemberId)
    }
  }),
  // Show empty message if no permissions exist
  renderWhileEmpty(['permissions'], NoPermissionsFound),
  withHandlers(handlers),
  withStyles(styles)
)
