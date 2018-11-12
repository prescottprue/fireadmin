import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'

export const OutlinedTextField = ({ input, label, classes }) => (
  <TextField
    id="outlined-helperText"
    label={label}
    className={classes.root}
    margin="normal"
    variant="outlined"
    {...input}
    InputProps={input}
  />
)

OutlinedTextField.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  input: PropTypes.object,
  label: PropTypes.string
}

export default OutlinedTextField
