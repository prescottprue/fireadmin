import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { withStateHandlers } from 'recompose'
import { firebaseConnect, firestoreConnect } from 'react-redux-firebase'
import {
  spinnerWhileLoading,
  renderWhileEmpty,
  renderIfError
} from 'utils/components'
import styles from './ProjectPage.styles'
import ProjectNotFoundPage from './ProjectNotFoundPage'
import ProjectErrorPage from './ProjectErrorPage'
import { withNotifications } from 'modules/notification'

export default compose(
  firebaseConnect(({ params }) => [`serviceAccounts/${params.projectId}`]),
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
  connect(({ firebase, firestore: { data } }, { params }) => ({
    auth: firebase.auth,
    project: get(data, `projects.${params.projectId}`)
  })),
  spinnerWhileLoading(['project']),
  renderWhileEmpty(['project'], ProjectNotFoundPage),
  renderIfError(
    [
      (state, { params }) => `projects.${params.projectId}`,
      (state, { params }) => `projects.${params.projectId}.events`,
      (state, { params }) => `projects.${params.projectId}.environments`
    ],
    ProjectErrorPage
  ),
  withNotifications,
  withStateHandlers(
    ({ initialActions = [] }) => ({
      selectedActions: initialActions,
      selectedServiceAccount: null,
      selectedInstance: null,
      envDialogOpen: false
    }),
    {
      addAction: ({ selectedActions }) => action => ({
        selectedActions: selectedActions.concat(action)
      }),
      toggleDialogWithData: ({ envDialogOpen }) => action => ({
        envDialogOpen: !envDialogOpen,
        selectedInstance: action
      }),
      toggleDialog: ({ envDialogOpen }) => () => ({
        envDialogOpen: !envDialogOpen
      }),
      removeAction: ({ selectedActions }) => ind => ({
        selectedActions: selectedActions.filter((_, i) => i !== ind)
      }),
      selectServiceAccount: ({ selectedServiceAccount }) => pickedAccount => ({
        selectedServiceAccount: pickedAccount
      })
    }
  ),
  withStyles(styles, { withTheme: true })
)
