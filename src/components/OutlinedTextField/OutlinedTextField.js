import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import styles from './OutlinedTextField.styles'

const useStyles = makeStyles(styles)

function OutlinedTextField({ input, label, ...other }) {
  const classes = useStyles()
  return (
    <TextField
      id={`outlined-helperText-${input.name}`}
      label={label}
      className={classes.root}
      margin="normal"
      variant="outlined"
      InputProps={input}
      inputProps={other} // eslint-disable-line react/jsx-no-duplicate-props
    />
  )
}

OutlinedTextField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string
}

export default OutlinedTextField
