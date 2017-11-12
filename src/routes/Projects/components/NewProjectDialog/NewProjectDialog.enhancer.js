import { compose } from 'redux'
import { withHandlers } from 'recompose'
import { reduxForm } from 'redux-form'
import { NEW_PROJECT_FORM_NAME } from 'constants'

export default compose(
  reduxForm({
    form: NEW_PROJECT_FORM_NAME
  }),
  withHandlers({
    createProject: ({ submit, onRequestClose }) => () => {
      submit && submit()
      onRequestClose && onRequestClose()
    }
  })
)
