import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { withStateHandlers } from 'recompose'
import firestoreConnect from 'react-redux-firebase/lib/firestoreConnect'
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
  // Map auth uid from state to props
  connect(({ firebase: { auth } }, { match: { params } }) => {
    return {
      projectId: params.projectId,
      uid: auth.uid,
      auth
    }
  }),
  // Wait for uid to exist before going further
  spinnerWhileLoading(['uid']),
  firestoreConnect(({ projectId }) => {
    return [
      // Project
      {
        collection: 'projects',
        doc: projectId
      },
      // Project environments
      {
        collection: 'projects',
        doc: projectId,
        subcollections: [{ collection: 'environments' }],
        orderBy: ['createdAt', 'desc'],
        storeAs: `environments-${projectId}`
      },
      // Service Account Uploads
      {
        collection: 'projects',
        doc: projectId,
        subcollections: [{ collection: 'serviceAccounts' }],
        orderBy: ['createdAt', 'desc'],
        storeAs: `serviceAccountUploads-${projectId}`
      }
    ]
  }),
  connect(({ firebase, firestore: { data } }, { projectId }) => ({
    project: get(data, `projects.${projectId}`)
  })),
  spinnerWhileLoading(['project']),
  renderWhileEmpty(['project'], ProjectNotFoundPage),
  renderIfError(
    [
      (state, { projectId }) => `projects.${projectId}`,
      (state, { projectId }) => `projects.${projectId}.environments`
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
      addAction: ({ selectedActions }) => (action) => ({
        selectedActions: selectedActions.concat(action)
      }),
      toggleDialogWithData: ({ envDialogOpen }) => (action) => ({
        envDialogOpen: !envDialogOpen,
        selectedInstance: action
      }),
      toggleDialog: ({ envDialogOpen }) => () => ({
        envDialogOpen: !envDialogOpen
      }),
      removeAction: ({ selectedActions }) => (ind) => ({
        selectedActions: selectedActions.filter((_, i) => i !== ind)
      }),
      selectServiceAccount: ({ selectedServiceAccount }) => (
        pickedAccount
      ) => ({
        selectedServiceAccount: pickedAccount
      })
    }
  ),
  withStyles(styles, { withTheme: true })
)
