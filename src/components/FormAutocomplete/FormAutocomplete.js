import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { find } from 'lodash'
import Autocomplete from '@material-ui/lab/Autocomplete'
import styles from './FormAutocomplete.styles'

const useStyles = makeStyles(styles)

function FormAutocomplete({ input, label, inputProps, options, ...other }) {
  const classes = useStyles()
  function labelOfEnvironment(id) {
    if (!id) {
      return null
    }
    const foundOption = find(options, { id })
    return foundOption && foundOption.name
  }
  return (
    <Autocomplete
      id={`outlined-helperText-${input.name}`}
      className={classes.root}
      options={options}
      {...input}
      {...other}
      inputValue={input.value}
      getOptionSelected={option => option.id === input.value}
      onChange={e => {
        if (!e.currentTarget) {
          input.onChange(null)
        } else {
          input.onChange(
            options[e.currentTarget.value]
              ? options[e.currentTarget.value].id
              : null
          )
        }
      }}
      renderInput={params => (
        <TextField
          value={labelOfEnvironment(input.value)}
          {...inputProps}
          {...params}
          // inputProps={other} // eslint-disable-line react/jsx-no-duplicate-props
          label={label}
          fullWidth
          variant="outlined"
          margin="normal"
        />
      )}
    />
  )
}

export default FormAutocomplete
