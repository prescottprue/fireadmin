import React from 'react'
import PropTypes from 'prop-types'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'

function FormSwitchField({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) {
  return (
    <FormControlLabel
      control={
        <Switch
          error={touched && invalid ? 'true' : 'false'}
          {...input}
          {...custom}
        />
      }
      label={label}
    />
  )
}

FormSwitchField.propTypes = {
  meta: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  label: PropTypes.string
}

export default FormSwitchField
