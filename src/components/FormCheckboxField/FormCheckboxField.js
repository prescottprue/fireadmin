import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from '@material-ui/core/Checkbox'

function FormTextField({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) {
  return <Checkbox label={label} placeholder={label} {...input} {...custom} />
}

FormTextField.propTypes = {
  formTextField: PropTypes.object
}

export default FormTextField
