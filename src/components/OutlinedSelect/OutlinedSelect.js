import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'
import styles from './OutlinedSelect.styles'

const useStyles = makeStyles(styles)

function OutlinedSelect({
  label,
  input,
  children,
  meta: { valid },
  inputProps
}) {
  const classes = useStyles()
  const [labelWidth, setLabelWidth] = useState(0)
  const textInput = useRef()

  useEffect(() => {
    // Update the document title using the browser API
    setLabelWidth(ReactDOM.findDOMNode(textInput).offsetWidth)
  }, [])

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel ref={textInput} htmlFor="outlined-age-simple">
        {label}
      </InputLabel>
      <Select
        fullWidth
        input={
          <OutlinedInput
            labelWidth={labelWidth}
            style={{ width: '100%' }}
            {...input}
            {...inputProps}
          />
        }
        {...input}>
        {children}
      </Select>
      {!valid ? <FormHelperText>Select an environment</FormHelperText> : null}
    </FormControl>
  )
}

OutlinedSelect.propTypes = {
  label: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  inputProps: PropTypes.object.isRequired,
  children: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired // from enhancer (withStyles)
}

export default OutlinedSelect
