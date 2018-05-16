import { compose } from 'redux'
import { withProps } from 'recompose'

export default compose(
  withProps(({ params: { projectId } }) => ({
    projectId
  }))
)
