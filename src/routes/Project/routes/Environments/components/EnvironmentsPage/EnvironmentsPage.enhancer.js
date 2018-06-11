import PropTypes from 'prop-types'
import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withFirebase, withFirestore } from 'react-redux-firebase'
import {
  withHandlers,
  withStateHandlers,
  setPropTypes,
  setDisplayName
} from 'recompose'
import { spinnerWhileLoading } from 'utils/components'
import { withNotifications } from 'modules/notification'
import * as handlers from './EnvironmentsPage.handlers'

export default compose(
  // Map redux state to props
  connect(({ firebase: { auth }, firestore: { ordered } }, { params }) => ({
    uid: auth.uid,
    // Listeners for redux data in ProjectsPage.enhancer
    projectEnvironments: get(ordered, `environments-${params.projectId}`)
  })),
  // Show a loading spinner while project data is loading
  spinnerWhileLoading(['projectEnvironments']),
  // Add props.firebase (used in handlers)
  withFirebase,
  // Add props.firestore (used in handlers)
  withFirestore,
  // Add props.showSuccess and props.showError
  withNotifications,
  withStateHandlers(
    () => ({
      selectedServiceAccount: null,
      selectedInstance: null,
      selectedDeleteKey: null,
      newDialogOpen: false,
      editDialogOpen: false,
      deleteDialogOpen: false
    }),
    {
      toggleNewDialog: ({ newDialogOpen }) => () => ({
        newDialogOpen: !newDialogOpen
      }),
      toggleDeleteDialog: ({ deleteDialogOpen }) => key => ({
        deleteDialogOpen: !deleteDialogOpen,
        selectedDeleteKey: deleteDialogOpen ? null : key
      }),
      toggleEditDialog: ({ editDialogOpen }) => (action, key) => ({
        editDialogOpen: !editDialogOpen,
        selectedInstance: editDialogOpen ? null : action,
        selectedKey: editDialogOpen ? null : key
      }),
      selectServiceAccount: ({ selectedServiceAccount }) => pickedAccount => ({
        selectedServiceAccount:
          selectedServiceAccount === pickedAccount ? null : pickedAccount
      }),
      clearServiceAccount: () => () => ({
        selectedServiceAccount: null
      })
    }
  ),
  // Set proptypes used in handlers
  setPropTypes({
    uid: PropTypes.string.isRequired,
    firebase: PropTypes.shape({
      uploadFiles: PropTypes.func.isRequired
    }).isRequired,
    firestore: PropTypes.shape({
      add: PropTypes.func.isRequired
    }).isRequired
  }),
  setDisplayName('EnvironmentsPage'),
  withHandlers(handlers)
)
