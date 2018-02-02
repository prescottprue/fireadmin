import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, groupBy } from 'lodash'
import { withProps } from 'recompose'
import { firestoreConnect } from 'react-redux-firebase'
import { formatDate } from 'utils/formatters'
import { spinnerWhileLoading } from 'utils/components'

export default compose(
  firestoreConnect(({ params }) => [
    {
      collection: 'projects',
      doc: get(params, 'projectId'),
      subcollections: [{ collection: 'events' }],
      orderBy: ['createdAt', 'desc'],
      limit: 40
    }
  ]),
  connect(({ firebase, firestore: { data } }, { params }) => ({
    project: get(data, `projects.${params.projectId}`)
  })),
  spinnerWhileLoading(['project']),
  withProps(({ project }) => {
    const events = get(project, 'events')
    if (events) {
      return {
        groupedEvents: groupBy(events, event => formatDate(event.createdAt))
      }
    }
  })
)
