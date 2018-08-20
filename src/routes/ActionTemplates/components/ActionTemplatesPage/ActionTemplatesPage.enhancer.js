import { compose } from 'redux'
import { UserIsAuthenticated } from 'utils/router'

export default compose(
  UserIsAuthenticated // redirect to /login if user is not authenticated
)
