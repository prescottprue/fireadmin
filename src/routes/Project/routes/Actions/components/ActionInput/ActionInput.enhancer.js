import { compose } from 'redux'
import { get } from 'lodash'
import { withHandlers } from 'recompose'
import { firestoreConnect } from 'react-redux-firebase'
import { connect } from 'react-redux'
import { withNotifications } from 'modules/notification'

export default compose(
  withNotifications,
  firestoreConnect(({ params }) => [
    {
      collection: 'projects',
      doc: params.projectId,
      subcollections: [{ collection: 'serviceAccounts' }]
    }
  ]),
  connect(({ firebase, firestore: { data } }, { params }) => ({
    auth: firebase.auth,
    project: get(data, `projects.${params.projectId}.serviceAccounts`)
  })),
  withHandlers({})
)
