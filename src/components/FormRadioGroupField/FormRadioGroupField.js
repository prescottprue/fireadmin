import React from 'react'
import PropTypes from 'prop-types'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'

function FormRadioGroupField({ label, input, children, options }) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        aria-label="gender"
        name="gender1"
        value={input.value}
        onChange={input.onChange}>
        {children ||
          (options &&
            options.map((option) => (
              <FormControlLabel
                key={option && option.value}
                value={option && option.value}
                disabled={option && option.disabled}
                control={<Radio />}
                label={option && option.label}
              />
            )))}
      </RadioGroup>
    </FormControl>
  )
}

FormRadioGroupField.propTypes = {
  children: PropTypes.object,
  options: PropTypes.array,
  meta: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  label: PropTypes.string
}

export default FormRadioGroupField
