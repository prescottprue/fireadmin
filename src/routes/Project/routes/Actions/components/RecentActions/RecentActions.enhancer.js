import { get, orderBy } from 'lodash'
import { compose, withHandlers, withProps } from 'recompose'
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
      where: ['eventType', '==', 'requestActionRun'],
      limit: 3,
      storeAs: 'recentActions'
    }
  ]),
  // Map redux state to props
  connect((state, { params }) => ({
    recentActions: get(state.firestore, `ordered.recentActions`)
  })),
  spinnerWhileLoading(['recentActions']),
  withProps(({ recentActions }) => ({
    orderedActions: orderBy(recentActions, ['createdAt'], ['desc'])
  })),
  withHandlers({
    rerunAction: props => action => {
      const templateWithValues = {
        ...action.eventData,
        ...action.eventData.template,
        inputValues: action.eventData.inputValues
      }
      props.selectActionTemplate(templateWithValues)
      initialize(formNames.actionRunner, templateWithValues)
    }
  })
)
