import { compose } from 'redux'
import { get } from 'lodash'
import { firestoreConnect } from 'react-redux-firebase'
import { connect } from 'react-redux'
import { withNotifications } from 'modules/notification'

export default compose(
  withNotifications,
  firestoreConnect(({ projectId }) => [
    {
      collection: 'projects',
      doc: projectId,
      subcollections: [{ collection: 'serviceAccounts' }]
    }
  ]),
  connect(({ firebase, firestore: { data } }, { projectId }) => ({
    project: get(data, `projects.${projectId}.serviceAccounts`)
  }))
)
