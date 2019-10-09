import PropTypes from 'prop-types'
import { compose, setPropTypes } from 'recompose'
import { reduxForm } from 'redux-form'
import { LOGIN_FORM_NAME } from 'constants/formNames'

export default compose(
  // Set proptypes used in HOCs
  setPropTypes({
    onSubmit: PropTypes.func.isRequired // called by handleSubmit
  }),
  // Add Form Capabilities
  reduxForm({
    form: LOGIN_FORM_NAME
  })
)
