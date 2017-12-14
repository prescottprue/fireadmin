import { size, get } from 'lodash'
import { compose } from 'redux'
import { withProps } from 'recompose'
import { paths } from 'constants'

export default compose(
  withProps(({ project, params }) => {
    const numberOfEnvironments = size(get(project, 'environments'))
    return {
      projectPath: `${paths.list}/${params.projectId}`,
      environmentsEmpty: numberOfEnvironments === 0,
      numberOfEnvironments,
      name: project.name
    }
  })
)
