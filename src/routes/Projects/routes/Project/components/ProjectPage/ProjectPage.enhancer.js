import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui-next/styles'
import { withHandlers, withStateHandlers } from 'recompose'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
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
    { collection: 'projects', doc: params.projectId }
  ]),
  connect(({ firebase, firestore: { data } }, { params }) => ({
    auth: firebase.auth,
    project: data.projects && data.projects[params.projectId],
    serviceAccounts: getVal(
      firebase,
      `data/serviceAccounts/${params.projectId}`
    )
  })),
  logProps(['project', 'serviceAccounts', 'auth']),
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
    addInstanceToFirestore: ({ firestore, showError }) => newInstance => {
      firestore
        .add({ collection: 'projects' }, newInstance)
        .then(res => showError('Project added successfully'))
        .catch(err =>
          showError('Error: ', err.message || 'Could not add project')
        )
    },
    addInstance: props => newInstance => {
      const {
        firestore,
        showError,
        params: { projectId },
        selectedServiceAccount,
        serviceAccounts
      } = props
      return firestore
        .add(
          { collection: 'instances' },
          {
            ...newInstance,
            serviceAccount: get(serviceAccounts, selectedServiceAccount, null),
            projectId
          }
        )
        .then(res => showError('Project added successfully'))
        .catch(err =>
          showError('Error: ', err.message || 'Could not add project')
        )
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
          console.log('res', res)
          props.selectServiceAccount(res)
          showError('Service Account Uploaded successfully')
        })
    }
  }),
  DragDropContext(HTML5Backend),
  withStyles(styles, { withTheme: true })
)
