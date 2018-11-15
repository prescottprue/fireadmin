import PropTypes from 'prop-types'
import { get, map } from 'lodash'
import { compose, withProps, setPropTypes } from 'recompose'
import { firestoreConnect } from 'react-redux-firebase'
import { connect } from 'react-redux'
import { spinnerWhileLoading, renderWhileEmpty } from 'utils/components'
import NoRecentActions from './NoRecentActions'
import { databaseURLToProjectName } from 'utils'

export default compose(
  // Set proptypes of props used in HOCs
  setPropTypes({
    projectId: PropTypes.string.isRequired
  }),
  // Map redux state to props
  firestoreConnect(({ projectId }) => [
    // Recent actions
    {
      collection: 'projects',
      doc: projectId,
      subcollections: [{ collection: 'events' }],
      where: ['eventType', '==', 'requestActionRun'],
      orderBy: ['createdAt', 'desc'],
      limit: 3,
      storeAs: `recentActions-${projectId}`
    }
  ]),
  // Map redux state to props
  connect(({ firebase, firestore }, { projectId }) => ({
    displayNames: get(firebase, 'data.displayNames'),
    recentActions: get(firestore, `ordered.recentActions-${projectId}`)
  })),
  // Show a loading spinner while actions are loading
  spinnerWhileLoading(['recentActions']),
  // Render NoRecentActions component if no recent actions exist
  renderWhileEmpty(['recentActions'], NoRecentActions),
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
  }))
)
