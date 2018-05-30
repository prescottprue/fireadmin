import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { spinnerWhileLoading } from 'utils/components'

export default compose(
  // map redux state to props
  connect(({ firestore: { data, ordered } }, { params: { projectId } }) => ({
    project: get(data, `projects.${projectId}`),
    serviceAccounts: get(ordered, `serviceAccountUploads-${projectId}`)
  })),
  // Show loading spinner until data has loaded
  spinnerWhileLoading(['serviceAccounts', 'project'])
)
