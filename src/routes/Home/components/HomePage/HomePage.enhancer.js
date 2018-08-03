import { withHandlers, compose } from 'recompose'
import { paths } from 'constants'
import { withRouter } from 'utils/components'

export default compose(
  withRouter,
  withHandlers({
    goToLogin: props => () => props.router.push(paths.login)
  })
)
