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
    serviceAccounts: getVal(firebase, `serviceAccounts/${params.projectId}`)
  })),
  branch(
    ({ auth, project, serviceAccounts }) => !isLoaded(project),
    renderComponent(LoadingSpinner)
  ),
  withFirestore,
  withNotifications,
  withHandlers({
    addInstance: ({ firestore, showError, showSuccess }) => newInstance => {
      firestore
        .add({ collection: 'projects' }, newInstance)
        .then(res => showSuccess('Project added successfully'))
        .catch(err =>
          showError('Error: ', err.message || 'Could not add project')
        )
    },
    uploadServiceAccount: props => files => {
      const {
        firebase,
        showSuccess,
        auth: { uid },
        params: { projectId }
      } = props
      const filePath = `serviceAccounts/${uid}/${projectId}`
      return firebase
        .uploadFiles(filePath, files, `serviceAccounts/${projectId}`)
        .then(res => {
          showSuccess('Service Account Uploaded successfully')
        })
    }
  }),
  withStateHandlers(
    ({ initialActions = [] }) => ({
      selectedActions: initialActions,
      newDialogOpen: false,
      drawerOpen: false
    }),
    {
      addAction: ({ selectedActions }) => action => ({
        selectedActions: selectedActions.concat(action)
      }),
      toggleDialog: ({ newDialogOpen }) => action => ({
        newDialogOpen: !newDialogOpen
      }),
      removeAction: ({ selectedActions }) => ind => ({
        selectedActions: selectedActions.filter((_, i) => i !== ind)
      }),
      openDrawer: ({ drawerOpen }) => e => ({ drawerOpen: true }),
      closeDrawer: ({ drawerOpen }) => e => ({ drawerOpen: false }),
      toggleDrawer: ({ drawerOpen }) => e => ({ drawerOpen: !drawerOpen })
    }
  ),
  DragDropContext(HTML5Backend),
  withStyles(styles, { withTheme: true })
)
