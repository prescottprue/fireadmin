import { connect } from 'react-redux'
import { isSubmitting } from 'redux-form'
import { PROJECT_PERMISSIONS_FORM_NAME } from 'constants/formNames'
import { createPermissionChecker } from 'utils'
import { getCurrentUserCreatedProject } from 'selectors'

export default connect((state, props) => {
  const permissionsSubmitting = isSubmitting(PROJECT_PERMISSIONS_FORM_NAME)(
    state
  )
  const userHasPermission = createPermissionChecker(state, props)
  const hasUpdatePermission = userHasPermission('update.permissions')
  const userCreatedProject = getCurrentUserCreatedProject(state, props)
  // Disable add member button in two cases
  //   1. form is submitting
  //   2. the current user is not the project creator and also does not have
  //      permissions update permission permission
  const addMemberDisabled =
    permissionsSubmitting || (!userCreatedProject && !hasUpdatePermission)
  return {
    hasUpdatePermission,
    addMemberDisabled
  }
})
