import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, firestoreConnect, getVal } from 'react-redux-firebase'
import { spinnerWhileLoading } from 'utils/components'

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
  })),
  // Show loading spinner until data has loaded
  spinnerWhileLoading(['serviceAccounts', 'project'])
)
