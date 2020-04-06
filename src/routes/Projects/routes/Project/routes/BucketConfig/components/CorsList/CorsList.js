import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import DeleteIcon from '@material-ui/icons/Delete'
import { makeStyles } from '@material-ui/core/styles'
import CorsOriginList from '../CorsOriginList'
import styles from './CorsList.styles'
import { useFormContext, useFieldArray, Controller } from 'react-hook-form'

const useStyles = makeStyles(styles)

const methods = ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']

function CorsList({ name, meta: { error, submitFailed } }) {
  const classes = useStyles()
  const { control, register } = useFormContext()
  const { fields, remove, append } = useFieldArray({ control, name })

  return (
    <div>
      {fields.map((member, index) => (
        <div key={index} className={classes.item}>
          <div className="flex-row">
            <Typography className={classes.subHeader} variant="h5">
              CORS Config #{index + 1}
            </Typography>
            <IconButton onClick={() => remove(index)}>
              <DeleteIcon />
            </IconButton>
          </div>
          <div className="flex-column">
            <CorsOriginList name={`${member}.origin`} />
            <FormControl className={classes.field}>
              <InputLabel htmlFor="method">HTTP Methods To Include</InputLabel>
              <Controller
                as={
                  <Select fullWidth multiple>
                    {methods.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                }
                name={`${member}.method`}
                control={control}
                defaultValue=""
              />
            </FormControl>
            <TextField
              name={`${member}.maxAgeSeconds`}
              label="Max Age (in seconds)"
              type="number"
              margin="normal"
              inputRef={register}
              fullWidth
            />
          </div>
        </div>
      ))}
      <div className={classes.add}>
        <Button color="primary" onClick={() => append({ origin: [''] })}>
          Add CORS Config
        </Button>
        {submitFailed && error && <span>{error}</span>}
      </div>
    </div>
  )
}

CorsList.propTypes = {
  fields: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired
}

export default CorsList
