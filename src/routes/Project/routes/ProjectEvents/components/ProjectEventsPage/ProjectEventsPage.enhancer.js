import { compose } from 'redux'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { spinnerWhileLoading } from 'utils/components'
import { firestoreConnect } from 'react-redux-firebase'

export default compose(
  firestoreConnect(({ params }) => [
    {
      collection: 'projects',
      doc: get(params, 'projectId'),
      subcollections: [{ collection: 'events' }]
    }
  ]),
  connect(({ firebase, firestore: { data } }, { params }) => ({
    project: get(data, `projects.${params.projectId}`)
  })),
  spinnerWhileLoading(['project'])
)
