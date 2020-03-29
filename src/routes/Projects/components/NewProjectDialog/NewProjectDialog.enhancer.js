import { compose } from 'redux'
import { reduxForm } from 'redux-form'
import { withHandlers } from 'recompose'
import { NEW_PROJECT_FORM_NAME } from 'constants/formNames'

export default compose(
  reduxForm({
    form: NEW_PROJECT_FORM_NAME,
    // Clear the form for future use (creating another project)
    onSubmitSuccess: (result, dispatch, props) => props.reset()
  }),
  withHandlers({
    closeAndReset: (props) => () => {
      props.reset()
      props.onRequestClose && props.onRequestClose()
    }
  })
)
