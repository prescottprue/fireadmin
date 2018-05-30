import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, map, groupBy } from 'lodash'
import { withProps } from 'recompose'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { formatDate } from 'utils/formatters'
import { spinnerWhileLoading, renderWhileEmpty } from 'utils/components'
import NoProjectEvents from './NoProjectEvents'

export default compose(
  firebaseConnect(['displayNames']),
  firestoreConnect(({ params }) => [
    {
      collection: 'projects',
      doc: get(params, 'projectId'),
      subcollections: [{ collection: 'events' }],
      orderBy: ['createdAt', 'desc'],
      storeAs: `projectEvents-${params.projectId}`,
      limit: 300
    }
  ]),
  connect(({ firebase, firestore }, { params }) => ({
    projectEvents: get(firestore, `data.projectEvents-${params.projectId}`),
    displayNames: get(firebase, 'data.displayNames')
  })),
  spinnerWhileLoading(['projectEvents']),
  renderWhileEmpty(['projectEvents'], NoProjectEvents),
  withProps(({ projectEvents, displayNames }) => {
    const events = map(projectEvents, event => {
      const createdBy = get(event, 'createdBy')
      if (createdBy) {
        return {
          ...event,
          createdBy: get(displayNames, createdBy, createdBy)
        }
      }
      return event
    })
    if (events) {
      return {
        groupedEvents: groupBy(events, event => formatDate(event.createdAt))
      }
    }
  })
)
