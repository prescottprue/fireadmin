import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { renderNothing } from 'recompose'
import { firestoreConnect } from 'react-redux-firebase'
import { renderWhileEmpty, spinnerWhileLoading } from 'utils/components'

export default compose(
  // Create Listeners on mount
  firestoreConnect(({ projectId }) => [
    // Service Accounts
    {
      collection: 'projects',
      doc: projectId,
      subcollections: [{ collection: 'serviceAccountUploads' }],
      orderBy: ['createdAt', 'desc'],
      storeAs: `serviceAccounts-${projectId}`
    }
  ]),
  // Map redux state to props
  connect(({ firestore: { ordered } }, { projectId }) => ({
    serviceAccounts: get(ordered, `serviceAccounts-${projectId}`)
  })),
  // Show spinner while loading
  spinnerWhileLoading(['serviceAccounts']),
  // Hide if no service accounts
  renderWhileEmpty(['serviceAccounts'], renderNothing())
)
