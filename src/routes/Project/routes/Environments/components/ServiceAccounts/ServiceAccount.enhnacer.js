import React from 'react'
import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { renderWhileEmpty } from 'utils/components'

export default compose(
  firestoreConnect(({ projectId }) => [
    {
      collection: 'projects',
      doc: projectId,
      subcollections: [{ collection: 'serviceAccountUploads' }],
      storeAs: `serviceAccounts-${projectId}`
    }
  ]),
  // Map redux state to props
  connect(({ firestore: { ordered } }, { projectId }) => ({
    serviceAccounts: get(ordered, `serviceAccounts-${projectId}`)
  })),
  renderWhileEmpty(['serviceAccounts'], () => <div>No Service Accounts </div>)
)
