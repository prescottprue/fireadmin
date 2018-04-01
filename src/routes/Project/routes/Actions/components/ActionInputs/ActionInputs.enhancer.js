import { get } from 'lodash'
import { compose } from 'redux'
import { formValues } from 'redux-form'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
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
  connect(({ firestore: { data } }, { params }) => ({
    serviceAccounts: get(data, `projects.${params.projectId}.serviceAccounts`)
  })),
  formValues('inputs')
)
