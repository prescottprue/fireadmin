import { compose } from 'redux'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { withStyles } from '@material-ui/core/styles'
import { spinnerWhileLoading } from 'utils/components'
import { getProjectEventsGroupedByDate } from 'selectors/projectSelectors'
import styles from './ProjectEventsPage.styles'

export default compose(
  // Attach RTDB listeners
  firebaseConnect(['displayNames']),
  // Attach Firestore listeners
  firestoreConnect(({ params }) => [
    {
      collection: 'projects',
      doc: get(params, 'projectId'),
      subcollections: [{ collection: 'events' }],
      orderBy: ['createdAt', 'desc'],
      storeAs: `projectEvents-${params.projectId}`,
      limit: 100
    }
  ]),
  connect((state, props) => ({
    projectEvents: getProjectEventsGroupedByDate(state, props)
  })),
  // Show spinner while project events are loading
  spinnerWhileLoading(['projectEvents']),
  // Add styles as props.classes
  withStyles(styles)
)
