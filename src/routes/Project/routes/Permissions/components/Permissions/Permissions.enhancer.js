import { get } from 'lodash'
import { compose } from 'redux'
import { withProps, withStateHandlers } from 'recompose'
import { connect } from 'react-redux'
import { isSubmitting } from 'redux-form'
import { formNames } from 'constants'
import { currentUserPermissionsByType } from 'selectors'

const createPermissionChecker = (state, props) => permission => {
  const permissionsByType = currentUserPermissionsByType(state, props)
  return get(permissionsByType, permission) === true
}

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
    return {
      hasUpdatePermission,
      addMemberDisabled: permissionsSubmitting || !hasUpdatePermission
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
