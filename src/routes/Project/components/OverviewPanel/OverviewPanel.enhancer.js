import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withProps } from 'recompose'
import { paths } from 'constants'

export default compose(
  // Listeners for redux data in ProjectsPage.enhancer
  connect(({ firebase: { auth }, firestore: { ordered } }, { params }) => {
    const numberOfEnvironments = get(
      ordered,
      `environments-${params.projectId}`,
      []
    ).length
    return {
      numberOfEnvironments,
      environmentsEmpty: numberOfEnvironments === 0
    }
  }),
  withProps(({ project, params }) => {
    return {
      projectPath: `${paths.list}/${params.projectId}`,
      name: project.name
    }
  })
)
