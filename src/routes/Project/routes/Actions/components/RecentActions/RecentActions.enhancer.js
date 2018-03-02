import { get } from 'lodash'
import { compose, withHandlers } from 'recompose'
import { firestoreConnect } from 'react-redux-firebase'
import { connect } from 'react-redux'
import { initialize } from 'redux-form'
import { spinnerWhileLoading } from 'utils/components'
import { formNames } from 'constants'

export default compose(
  // Map redux state to props

  firestoreConnect(({ params, auth }) => [
    // Project environments
    {
      collection: 'projects',
      doc: params.projectId,
      subcollections: [{ collection: 'events' }],
      // where: ['eventType', '==', 'requestActionRun'],
      orderBy: ['createdAt'],
      limit: 3,
      storeAs: 'recentActions'
    }
  ]),
  // Map redux state to props
  connect((state, { params }) => ({
    recentActions: get(state.firestore, `data.recentActions`)
  })),
  spinnerWhileLoading(['recentActions']),
  withHandlers({
    rerunAction: props => action => {
      // TODO: Initialize with the right data
      initialize(formNames.actionRunner, action.eventData)
    }
  })
)
