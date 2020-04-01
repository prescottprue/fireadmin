import { get } from 'lodash'
import { connect } from 'react-redux'

export default connect(({ firestore: { data, ordered } }, { projectId }) => ({
  project: get(data, `projects.${projectId}`),
  environments: get(ordered, `environments-${projectId}`)
}))
