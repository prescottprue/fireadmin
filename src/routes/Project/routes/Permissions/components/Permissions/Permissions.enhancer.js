import { compose } from 'redux'
import { withProps, withStateHandlers, withHandlers } from 'recompose'
import { reduxForm } from 'redux-form'

export default compose(
  withProps(({ params: { projectId } }) => ({
    projectId
  })),
  reduxForm({
    form: 'permissions'
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
  ),
  withHandlers({
    addNewMemeber: props => () => {
      props.change('')
    }
  })
)
