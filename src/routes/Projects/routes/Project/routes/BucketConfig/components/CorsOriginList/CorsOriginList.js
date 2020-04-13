import React from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import DeleteIcon from '@material-ui/icons/Delete'
import { makeStyles } from '@material-ui/core/styles'
import styles from './CorsOriginList.styles'

const useStyles = makeStyles(styles)

function CorsOriginList({ name }) {
  const classes = useStyles()
  const { control, register } = useFormContext()
  const { fields, remove, append } = useFieldArray({ control, name })
  return (
    <div style={{ marginBottom: '1rem' }}>
      {fields.map((item, index) => (
        <div className="flex-row" key={`Origin-${name}[${index}]`}>
          <TextField
            name={`${name}[${index}]`}
            label="Origin"
            margin="normal"
            inputRef={register}
            fullWidth
          />
          {index !== 0 && (
            <IconButton
              onClick={() => remove(index)}
              style={{ marginTop: '1.5rem' }}>
              <DeleteIcon />
            </IconButton>
          )}
        </div>
      ))}
      <div className={classes.add}>
        <Button color="primary" onClick={() => append({})}>
          Add Origin
        </Button>
      </div>
    </div>
  )
}

export default CorsOriginList
