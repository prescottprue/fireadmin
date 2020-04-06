import React from 'react'
import PropTypes from 'prop-types'
import { useFormContext, useFieldArray } from 'react-hook-form'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import DeleteIcon from '@material-ui/icons/Delete'
import { makeStyles } from '@material-ui/core/styles'
import styles from './CorsOriginList.styles'

const useStyles = makeStyles(styles)

function CorsOriginList({ name, meta: { error, submitFailed } }) {
  const classes = useStyles()
  const { control, register } = useFormContext()
  const { fields, remove, append } = useFieldArray({ control, name })

  return (
    <div style={{ marginBottom: '1rem' }}>
      <Typography variant="h5">Origins</Typography>
      <div className={classes.add}>
        <Button color="primary" onClick={() => append({})}>
          Add Origin
        </Button>
        {submitFailed && error && <span>{error}</span>}
      </div>
      {fields.map((member, index) => (
        <div className="flex-row" key={`Origin-${index}`}>
          <TextField
            name={member}
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
    </div>
  )
}

CorsOriginList.propTypes = {
  fields: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired
}

export default CorsOriginList
