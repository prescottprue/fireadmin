import { compose } from 'redux'
import { withProps, withStateHandlers } from 'recompose'
import { connect } from 'react-redux'
import { isSubmitting } from 'redux-form'
import { formNames } from 'constants'

export default compose(
  withProps(({ params: { projectId } }) => ({
    projectId
  })),
  connect((state, { projectId }) => ({
    permissionsSubmitting: isSubmitting(formNames.projectPermissions)(state)
  })),
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
