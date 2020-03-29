import { compose } from 'redux'
import { withHandlers } from 'recompose'
import { withRouter } from 'react-router-dom'
import { LIST_PATH } from 'constants/paths'

export default compose(
  withRouter,
  withHandlers({
    goTo: ({ history, match }) => (value) => {
      history.push(`${LIST_PATH}/${match.params.projectId}/${value}`)
    },
    itemIsActive: ({ location, match }) => (value) => {
      const currentParentRoute = `${LIST_PATH}/${match.params.projectId}/`
      return value === ''
        ? `${location.pathname}/` === currentParentRoute ||
            location.pathname === currentParentRoute
        : location.pathname.endsWith(value)
    }
  })
)
