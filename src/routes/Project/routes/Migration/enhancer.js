import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers, withStateHandlers } from 'recompose'
import { firebaseConnect, getVal, withFirestore } from 'react-redux-firebase'
import { withNotifications } from 'modules/notification'
// import { DragDropContext } from 'react-dnd'
// import HTML5Backend from 'react-dnd-html5-backend'

export default compose(
  withFirestore,
  withNotifications,
  firebaseConnect(['serviceAccounts/test']),
  connect(({ firebase: { data } }) => ({
    files: getVal(data, 'serviceAccounts/test')
  })),
  withHandlers({
    addProject: ({ firestore, showError }) => newProject => {
      firestore
        .add({ collection: 'projects' }, newProject)
        .then(res => showError('Project added successfully'))
        .catch(err =>
          showError('Error: ', err.message || 'Could not add project')
        )
    },
    uploadServiceAccount: ({ firebase }) => files => {
      return firebase.uploadFiles(
        'serviceAccounts/test',
        files,
        'serviceAccounts/test'
      )
    }
  }),
  withStateHandlers(
    ({ initialActions = [] }) => ({
      selectedActions: initialActions
    }),
    {
      addAction: ({ selectedActions }) => action => ({
        selectedActions: selectedActions.concat(action)
      }),
      removeAction: ({ selectedActions }) => ind => ({
        selectedActions: selectedActions.filter((_, i) => i !== ind)
      })
    }
  )
  // DragDropContext(HTML5Backend)
)
