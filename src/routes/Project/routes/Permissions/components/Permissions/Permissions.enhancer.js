import { compose } from 'redux'
import { withProps, withStateHandlers } from 'recompose'
import { connect } from 'react-redux'
import { isSubmitting } from 'redux-form'
import { formNames } from 'constants'
import { createPermissionChecker } from 'utils'
import { getCurrentUserCreatedProject } from 'selectors'

export default compose(
  withProps(({ params: { projectId } }) => ({
    projectId
  })),
  connect((state, props) => {
    const permissionsSubmitting = isSubmitting(formNames.projectPermissions)(
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
  }),
  withStateHandlers(
    () => ({
      newMemberModalOpen: false
    }),
    {
      toggleNewMemberModal: ({ newMemberModalOpen }) => () => ({
        newMemberModalOpen: !newMemberModalOpen
      })
    }
  )
)
