import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui-next/styles'
import { withHandlers, withStateHandlers } from 'recompose'
import { firebaseConnect, getVal, firestoreConnect } from 'react-redux-firebase'
import {
  logProps,
  messageWhileEmpty,
  spinnerWhileLoading
} from 'utils/components'
import styles from './ProjectPage.styles'
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
    project: get(data, `projects.${params.projectId}`),
    serviceAccounts: getVal(
      firebase,
      `data/serviceAccounts/${params.projectId}`
    )
  })),
  logProps(['project', 'auth']),
  messageWhileEmpty(['project']),
  spinnerWhileLoading(['project']),
  withNotifications,
  withStateHandlers(
    ({ initialActions = [] }) => ({
      selectedActions: initialActions,
      selectedServiceAccount: null,
      selectedInstance: null,
      envDialogOpen: false,
      drawerOpen: false
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
      }),
      toggleDrawer: ({ drawerOpen }) => e => ({ drawerOpen: !drawerOpen })
    }
  ),
  withHandlers({
    addInstance: props => newProjectData => {
      const {
        firestore,
        showError,
        params: { projectId },
        selectedServiceAccount,
        serviceAccounts
      } = props
      const locationConf = {
        collection: 'projects',
        doc: projectId,
        subcollections: [{ collection: 'environments' }]
      }
      const newProject = {
        ...newProjectData,
        serviceAccount: get(serviceAccounts, selectedServiceAccount, null),
        projectId
      }
      return firestore
        .add(locationConf, newProject)
        .then(res => {
          props.toggleDialog()
          showError('Project added successfully')
        })
        .catch(err =>
          showError('Error: ', err.message || 'Could not add project')
        )
    },
    removeEnvironment: props => environmentId => {
      const { firestore, showError, params: { projectId } } = props
      return firestore
        .delete({
          collection: 'projects',
          doc: projectId,
          subcollections: [{ collection: 'environments', doc: environmentId }]
        })
        .then(res => {
          showError('Project deleted successfully')
        })
        .catch(err => {
          showError('Error: ', err.message || 'Could not add project')
        })
    },
    uploadServiceAccount: props => files => {
      const {
        firebase,
        showError,
        auth: { uid },
        params: { projectId }
      } = props
      const filePath = `serviceAccounts/${uid}/${projectId}`
      return firebase
        .uploadFiles(filePath, files, `serviceAccounts/${projectId}`)
        .then(res => {
          props.selectServiceAccount(res)
          showError('Service Account Uploaded successfully')
        })
    }
  }),
  withStyles(styles, { withTheme: true })
)
