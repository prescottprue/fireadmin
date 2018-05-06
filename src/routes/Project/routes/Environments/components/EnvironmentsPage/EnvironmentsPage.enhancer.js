import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers, withStateHandlers } from 'recompose'
import { firestoreConnect } from 'react-redux-firebase'
import {
  // logProps,
  spinnerWhileLoading
} from 'utils/components'
import { withNotifications } from 'modules/notification'
import * as handlers from './EnvironmentsPage.handlers'

export default compose(
  // Create Firestore listeners
  firestoreConnect(({ params }) => [
    {
      collection: 'projects',
      doc: params.projectId,
      subcollections: [{ collection: 'environments' }]
    },
    {
      collection: 'projects',
      doc: params.projectId
    }
  ]),
  // Map redux state to props
  connect(({ firebase, firestore: { data } }, { params }) => ({
    auth: firebase.auth,
    project: get(data, `projects.${params.projectId}`)
  })),
  // Show a loading spinner while project data is loading
  spinnerWhileLoading(['project']),
  // Add props.showSuccess and props.showError
  withNotifications,
  withStateHandlers(
    ({ initialEnvDialogOpen = false }) => ({
      selectedServiceAccount: null,
      selectedInstance: null,
      envDialogOpen: initialEnvDialogOpen
    }),
    {
      toggleDialogWithData: ({ envDialogOpen }) => (action, key) => ({
        envDialogOpen: !envDialogOpen,
        selectedInstance: action,
        selectedKey: key
      }),
      toggleDialog: ({ envDialogOpen }) => () => ({
        envDialogOpen: !envDialogOpen,
        selectedInstance: null,
        selectedKey: null
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
  withHandlers(handlers)
)
