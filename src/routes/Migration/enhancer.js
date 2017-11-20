import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStateHandlers } from 'recompose'
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
