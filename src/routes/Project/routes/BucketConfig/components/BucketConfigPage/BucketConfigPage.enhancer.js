import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, firestoreConnect, getVal } from 'react-redux-firebase'

export default compose(
  // create listeners for RTDB
  firebaseConnect(({ params }) => [`serviceAccounts/${params.projectId}`]),
  // create listeners for Firestore
  firestoreConnect(({ params }) => [
    // Environments subcollection of project
    {
      collection: 'projects',
      doc: params.projectId,
      subcollections: [{ collection: 'environments' }]
    },
    // Project
    {
      collection: 'projects',
      doc: params.projectId
    }
  ]),
  // map redux state to props
  connect(({ firebase, firestore: { data } }, { params }) => ({
    project: get(data, `projects.${params.projectId}`),
    serviceAccounts: getVal(
      firebase,
      `data/serviceAccounts/${params.projectId}`
    )
  }))
)
