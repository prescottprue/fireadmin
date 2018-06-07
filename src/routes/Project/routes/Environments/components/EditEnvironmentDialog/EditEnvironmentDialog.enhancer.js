import { compose } from 'redux'
import { withHandlers } from 'recompose'
import { reduxForm } from 'redux-form'
// import { formNames } from 'constants'

export default compose(
  reduxForm({
    form: 'editEnvironment'
  }),
  withHandlers({
    closeAndReset: ({ reset, onRequestClose }) => value => {
      reset()
      onRequestClose && onRequestClose()
    }
  })
)
