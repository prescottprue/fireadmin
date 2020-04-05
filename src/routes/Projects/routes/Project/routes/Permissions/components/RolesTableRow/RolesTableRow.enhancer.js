import { connect } from 'react-redux'
import { getCurrentUserCreatedProject } from 'selectors'
import { createPermissionChecker } from 'utils'

export default connect((state, props) => {
  const userHasPermission = createPermissionChecker(state, props)
  const hasUpdatePermission = userHasPermission('update.roles')
  const userCreatedProject = getCurrentUserCreatedProject(state, props)
  // Disable update button if the current user is not the project creator and
  // also does not have roles update permission
  return {
    updateRolesDisabled: !userCreatedProject && !hasUpdatePermission
  }
})
