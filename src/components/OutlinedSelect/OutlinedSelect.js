import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import styles from './OutlinedSelect.styles'

const useStyles = makeStyles(styles)

function OutlinedSelect({
  label,
  input,
  children,
  meta: { valid },
  inputProps,
  className
}) {
  const classes = useStyles()
  const [labelWidth, setLabelWidth] = useState(0)
  const textInput = useRef()

  useEffect(() => {
    // Update the document title using the browser API
    setLabelWidth(textInput.offsetWidth)
  }, [])

  return (
    <TextField
      select
      label={label}
      fullWidth
      variant="outlined"
      margin="normal"
      className={className || classes.root}
      helperText={input.value ? null : 'Select an environment'}
      SelectProps={{
        MenuProps: {
          className: classes.menu
        }
      }}
      input={
        <OutlinedInput labelWidth={labelWidth} {...input} {...inputProps} />
      }
      {...input}
      data-test={inputProps && inputProps['data-test']}>
      {children}
    </TextField>
  )
}

OutlinedSelect.propTypes = {
  label: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  inputProps: PropTypes.object.isRequired,
  children: PropTypes.array.isRequired
}

export default OutlinedSelect
