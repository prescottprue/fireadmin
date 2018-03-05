import { get, orderBy, map } from 'lodash'
import { compose, withHandlers, withProps } from 'recompose'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { connect } from 'react-redux'
import { initialize } from 'redux-form'
import { spinnerWhileLoading } from 'utils/components'
import { formNames } from 'constants'

export default compose(
  // Map redux state to props
  firebaseConnect(['displayNames']),
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
    displayNames: get(state.firebase, 'data.displayNames'),
    recentActions: get(state.firestore, `ordered.recentActions`)
  })),
  spinnerWhileLoading(['recentActions']),
  withProps(({ recentActions, displayNames }) => ({
    orderedActions: map(
      orderBy(recentActions, ['createdAt'], ['desc']),
      event => {
        const createdBy = get(event, 'createdBy')
        if (createdBy) {
          return {
            ...event,
            createdBy: get(displayNames, createdBy, createdBy)
          }
        }
        return event
      }
    )
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
