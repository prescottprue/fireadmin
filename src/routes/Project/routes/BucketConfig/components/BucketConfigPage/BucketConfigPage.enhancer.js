import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { spinnerWhileLoading } from 'utils/components'

export default compose(
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
    },
    // Service Accounts
    {
      collection: 'projects',
      doc: params.projectId,
      subcollections: [{ collection: 'serviceAccountUploads' }],
      orderBy: ['createdAt', 'desc'],
      storeAs: `serviceAccounts-${params.projectId}`
    }
  ]),
  // map redux state to props
  connect(({ firestore: { data, ordered } }, { params: { projectId } }) => ({
    project: get(data, `projects.${projectId}`),
    serviceAccounts: get(ordered, `serviceAccounts-${projectId}`)
  })),
  // Show loading spinner until data has loaded
  spinnerWhileLoading(['serviceAccounts', 'project'])
)
