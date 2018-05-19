import { compose } from 'redux'
import { withProps } from 'recompose'
import { reduxForm } from 'redux-form'

export default compose(
  withProps(({ params: { projectId } }) => ({
    projectId
  })),
  reduxForm({
    form: 'permissions'
  })
  // withStateHandlers(() => ({
  //
  // }), {
  //
  // })
  // withHandlers({
  //   addNewMemeber: props => () => {
  //     props.change('')
  //   }
  // })
)
