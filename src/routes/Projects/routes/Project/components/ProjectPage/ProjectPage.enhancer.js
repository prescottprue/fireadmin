import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui-next/styles'
import {
  withHandlers,
  withStateHandlers,
  branch,
  renderComponent
} from 'recompose'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import {
  firebaseConnect,
  getVal,
  isLoaded,
  withFirestore,
  populate
} from 'react-redux-firebase'
// import { withRouter } from 'utils/components'
import styles from './ProjectPage.styles'
import LoadingSpinner from 'components/LoadingSpinner'
import { withNotifications } from 'modules/notification'

const populates = [{ child: 'instances', root: `instances` }]

export default compose(
  firebaseConnect(({ params }) => [
    { path: `projects/${params.projectId}`, populates },
    `serviceAccounts/${params.projectId}`
  ]),
  connect(({ firebase: { data, auth }, firebase }, { params }) => ({
    auth,
    project: populate(firebase, `projects/${params.projectId}`, populates),
    serviceAccounts: getVal(
      firebase,
      `data/serviceAccounts/${params.projectId}`
    )
  })),
  branch(
    ({ auth, project, serviceAccounts }) => !isLoaded(project),
    renderComponent(LoadingSpinner)
  ),
  withFirestore,
  withNotifications,
  withHandlers({
    addInstanceToFirestore: ({ firestore, showError }) => newInstance => {
      firestore
        .add({ collection: 'projects' }, newInstance)
        .then(res => showError('Project added successfully'))
        .catch(err =>
          showError('Error: ', err.message || 'Could not add project')
        )
    },
    addInstance: ({ firebase, showError, initialValues }) => newInstance => {
      const method = initialValues ? firebase.update : firebase.push
      method('projects', newInstance)
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
          showError('Service Account Uploaded successfully')
        })
    }
  }),
  withStateHandlers(
    ({ initialActions = [] }) => ({
      selectedActions: initialActions,
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
      toggleDrawer: ({ drawerOpen }) => e => ({ drawerOpen: !drawerOpen })
    }
  ),
  DragDropContext(HTML5Backend),
  withStyles(styles, { withTheme: true })
)
