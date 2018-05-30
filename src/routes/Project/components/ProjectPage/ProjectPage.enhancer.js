import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { withStateHandlers } from 'recompose'
import { firestoreConnect } from 'react-redux-firebase'
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
  firestoreConnect(({ params }) => [
    // Project
    {
      collection: 'projects',
      doc: params.projectId
    },
    // Project environments
    {
      collection: 'projects',
      doc: params.projectId,
      subcollections: [{ collection: 'environments' }],
      orderBy: ['createdAt', 'desc'],
      storeAs: `environments-${params.projectId}`
    },
    // Service Accounts
    {
      collection: 'projects',
      doc: params.projectId,
      subcollections: [{ collection: 'serviceAccountUploads' }],
      orderBy: ['createdAt', 'desc'],
      storeAs: `serviceAccountUploads-${params.projectId}`
    },
    // Service Account Uploads
    {
      collection: 'projects',
      doc: params.projectId,
      subcollections: [{ collection: 'serviceAccounts' }],
      orderBy: ['createdAt', 'desc'],
      storeAs: `serviceAccountUploads-${params.projectId}`
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
      (state, { params }) => `projects.${params.projectId}.serviceAccounts`,
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
