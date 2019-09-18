import React from 'react'
import PropTypes from 'prop-types'
import Select from '@material-ui/core/Select'

function FormTextField({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) {
  return (
    <Select
      label={label}
      placeholder={label}
      error={touched && invalid}
      {...input}
      {...custom}
    />
  )
}

FormTextField.propTypes = {
  formTextField: PropTypes.object
}

export default FormTextField
