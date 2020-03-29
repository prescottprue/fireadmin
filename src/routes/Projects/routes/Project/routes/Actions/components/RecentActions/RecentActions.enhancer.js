import PropTypes from 'prop-types'
import { get, map } from 'lodash'
import { compose, withProps, setPropTypes } from 'recompose'
import firestoreConnect from 'react-redux-firebase/lib/firestoreConnect'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { spinnerWhileLoading, renderWhileEmpty } from 'utils/components'
import NoRecentActions from './NoRecentActions'
import { databaseURLToProjectName } from 'utils'
import styles from './RecentActions.styles'

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
    recentActions: get(firestore, `ordered.recentActions-${projectId}`),
    environments: get(firestore, `data.environments-${projectId}`)
  })),
  // Show a loading spinner while actions are loading
  spinnerWhileLoading(['recentActions']),
  // Render NoRecentActions component if no recent actions exist
  renderWhileEmpty(['recentActions'], NoRecentActions),
  withProps(({ recentActions, displayNames, environments }) => ({
    orderedActions: map(recentActions, (event) => {
      const createdBy = get(event, 'createdBy')
      const envLabelFromEnvironmentValIndex = (envIndex = 0) => {
        const envKey = get(event, `eventData.environmentValues.${envIndex}`)
        const envName = get(environments, `${envKey}.name`)
        const envUrl =
          get(environments, `${envKey}.databaseURL`) ||
          get(event, `eventData.inputValues.${envIndex}.databaseURL`, '')
        const firebaseProjectName = databaseURLToProjectName(envUrl)
        return `${envName} (${firebaseProjectName})`
      }
      if (createdBy) {
        return {
          ...event,
          src: envLabelFromEnvironmentValIndex(0),
          dest: envLabelFromEnvironmentValIndex(1),
          createdBy: get(displayNames, createdBy, createdBy)
        }
      }
      return event
    })
  })),
  withStyles(styles)
)
