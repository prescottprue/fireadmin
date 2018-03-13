import { get, map } from 'lodash'
import { compose, withHandlers, withProps } from 'recompose'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { connect } from 'react-redux'
import { initialize } from 'redux-form'
import { spinnerWhileLoading, renderWhileEmpty } from 'utils/components'
import NoRecentActions from './NoRecentActions'
import { formNames } from 'constants'

export default compose(
  firebaseConnect(['displayNames']),
  // Map redux state to props
  firestoreConnect(({ params, auth }) => [
    // Project environments
    {
      collection: 'projects',
      doc: params.projectId,
      subcollections: [{ collection: 'events' }],
      where: ['eventType', '==', 'requestActionRun'],
      orderBy: ['createdAt', 'desc'],
      limit: 3,
      storeAs: 'recentActions'
    }
  ]),
  // Map redux state to props
  connect((state, { params }) => ({
    displayNames: get(state.firebase, 'data.displayNames'),
    recentActions: get(state.firestore, `ordered.recentActions`)
  })),
  renderWhileEmpty(['recentActions'], NoRecentActions),
  spinnerWhileLoading(['recentActions']),
  withProps(({ recentActions, displayNames }) => ({
    orderedActions: map(recentActions, event => {
      const createdBy = get(event, 'createdBy')
      if (createdBy) {
        return {
          ...event,
          createdBy: get(displayNames, createdBy, createdBy)
        }
      }
      return event
    })
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
