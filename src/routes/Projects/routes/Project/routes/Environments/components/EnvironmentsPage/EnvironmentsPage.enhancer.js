import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import withFirestore from 'react-redux-firebase/lib/withFirestore'
import withFirebase from 'react-redux-firebase/lib/withFirebase'
import { withHandlers, withStateHandlers } from 'recompose'
import { spinnerWhileLoading } from 'utils/components'
import { withNotifications } from 'modules/notification'
import * as handlers from './EnvironmentsPage.handlers'

export default compose(
  // Map redux state to props
  connect(({ firebase: { auth }, firestore: { ordered } }, { projectId }) => ({
    uid: auth.uid,
    // Listeners for redux data in ProjectsPage.enhancer
    projectEnvironments: get(ordered, `environments-${projectId}`)
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
      toggleDeleteDialog: ({ deleteDialogOpen }) => (key) => ({
        deleteDialogOpen: !deleteDialogOpen,
        selectedDeleteKey: deleteDialogOpen ? null : key
      }),
      toggleEditDialog: ({ editDialogOpen }) => (action, key) => ({
        editDialogOpen: !editDialogOpen,
        selectedInstance: editDialogOpen ? null : action,
        selectedKey: editDialogOpen ? null : key
      }),
      selectServiceAccount: ({ selectedServiceAccount }) => (
        pickedAccount
      ) => ({
        selectedServiceAccount:
          selectedServiceAccount === pickedAccount ? null : pickedAccount
      }),
      clearServiceAccount: () => () => ({
        selectedServiceAccount: null
      })
    }
  ),
  withHandlers(handlers)
)
