import { compose } from 'redux'
import { connect } from 'react-redux'
import firestoreConnect from 'react-redux-firebase/lib/firestoreConnect'
import firebaseConnect from 'react-redux-firebase/lib/firebaseConnect'
import { withStyles } from '@material-ui/core/styles'
import { spinnerWhileLoading } from 'utils/components'
import { getProjectEventsGroupedByDate } from 'selectors/projectSelectors'
import styles from './ProjectEventsPage.styles'

export default compose(
  // Attach RTDB listeners
  firebaseConnect(['displayNames']),
  // Attach Firestore listeners
  firestoreConnect(({ projectId }) => [
    {
      collection: 'projects',
      doc: projectId,
      subcollections: [{ collection: 'events' }],
      orderBy: ['createdAt', 'desc'],
      storeAs: `projectEvents-${projectId}`,
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
