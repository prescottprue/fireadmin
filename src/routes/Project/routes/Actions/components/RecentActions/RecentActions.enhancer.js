import { get, map } from 'lodash'
import { compose, withHandlers, withProps } from 'recompose'
import { firestoreConnect } from 'react-redux-firebase'
import { connect } from 'react-redux'
import { initialize } from 'redux-form'
import { spinnerWhileLoading, renderWhileEmpty } from 'utils/components'
import NoRecentActions from './NoRecentActions'
import { databaseURLToProjectName } from 'utils'
import { formNames } from 'constants'

export default compose(
  // Map redux state to props
  firestoreConnect(({ params, auth }) => [
    // Recent actions
    {
      collection: 'projects',
      doc: params.projectId,
      subcollections: [{ collection: 'events' }],
      where: ['eventType', '==', 'requestActionRun'],
      orderBy: ['createdAt', 'desc'],
      limit: 3,
      storeAs: `recentActions-${params.projectId}`
    }
  ]),
  // Map redux state to props
  connect(({ firebase, firestore }, { params: { projectId } }) => ({
    displayNames: get(firebase, 'data.displayNames'),
    recentActions: get(firestore, `ordered.recentActions-${projectId}`)
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
    }),
    actionToEnvironments: action => ({
      src: databaseURLToProjectName(
        get(
          action,
          'eventData.environments.0.databaseURL',
          get(action, 'eventData.inputValues.0.databaseURL', '')
        )
      ),
      dest: databaseURLToProjectName(
        get(
          action,
          'eventData.environments.1.databaseURL',
          get(action, 'eventData.inputValues.1.databaseURL', '')
        )
      )
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
