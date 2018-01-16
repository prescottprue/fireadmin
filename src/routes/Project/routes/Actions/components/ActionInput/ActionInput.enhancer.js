import { compose } from 'redux'
import { withHandlers } from 'recompose'
import { connect } from 'react-redux'
import { firebaseConnect, getVal } from 'react-redux-firebase'
import { withNotifications } from 'modules/notification'

export default compose(
  withNotifications,
  firebaseConnect(({ projectId }) => [`serviceAccounts/${projectId}`]),
  connect(({ firebase }, { projectId }) => ({
    serviceAccounts: getVal(firebase, `data/serviceAccounts/${projectId}`)
  })),
  withHandlers({})
)
