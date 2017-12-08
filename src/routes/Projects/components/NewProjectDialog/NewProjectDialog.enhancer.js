import { compose } from 'redux'
import { withHandlers } from 'recompose'
import { reduxForm } from 'redux-form'
import { NEW_PROJECT_FORM_NAME } from 'constants'

export default compose(
  reduxForm({
    form: NEW_PROJECT_FORM_NAME,
    // Clear the form for future use (creating another project)
    onSubmitSuccess: (result, dispatch, props) => props.reset()
  }),
  withHandlers({
    createProject: ({ submit, reset, onRequestClose }) => () => {
      // Submit form (calling props.onSubmit which is passed to component)
      submit && submit()
      // Close the modal
      onRequestClose && onRequestClose()
    }
  })
)
