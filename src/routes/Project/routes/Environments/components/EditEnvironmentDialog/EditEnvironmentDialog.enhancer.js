import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withHandlers, setPropTypes } from 'recompose'
import { reduxForm } from 'redux-form'
// import { formNames } from 'constants'

export default compose(
  reduxForm({
    form: 'editEnvironment'
  }),
  setPropTypes({
    reset: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired
  }),
  withHandlers({
    closeAndReset: ({ reset, onRequestClose }) => value => {
      reset()
      onRequestClose && onRequestClose()
    }
  })
)
