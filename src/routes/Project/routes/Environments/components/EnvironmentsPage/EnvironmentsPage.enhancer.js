import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers, withStateHandlers } from 'recompose'
import { spinnerWhileLoading } from 'utils/components'
import { withNotifications } from 'modules/notification'
import * as handlers from './EnvironmentsPage.handlers'

export default compose(
  // Map redux state to props
  connect(({ firebase: { auth }, firestore: { ordered } }, { params }) => ({
    auth,
    // Listeners for redux data in ProjectsPageEnhancer
    projectEnvironments: get(ordered, `environments-${params.projectId}`)
  })),
  // Show a loading spinner while project data is loading
  spinnerWhileLoading(['projectEnvironments']),
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
