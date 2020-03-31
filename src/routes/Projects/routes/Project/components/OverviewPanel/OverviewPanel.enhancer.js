import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'

export default compose(
  // Listeners for redux data in ProjectsPage.enhancer
  connect(({ firebase: { auth }, firestore: { ordered } }, { projectId }) => {
    const numberOfEnvironments = get(ordered, `environments-${projectId}`, [])
      .length
    return {
      numberOfEnvironments,
      environmentsEmpty: numberOfEnvironments === 0
    }
  })
)
