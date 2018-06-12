import React from 'react'
import PropTypes from 'prop-types'
import classes from './CorsList.scss'
import IconButton from '@material-ui/core/IconButton'
import { Field, FieldArray } from 'redux-form'
import { TextField, Select } from 'redux-form-material-ui'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import DeleteIcon from '@material-ui/icons/Delete'
import CorsOriginList from '../CorsOriginList'

const methods = ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']

export const CorsList = ({ fields, meta: { error, submitFailed } }) => (
  <div>
    {fields.map((member, index) => (
      <div key={index} className={classes.item}>
        <div className="flex-row">
          <Typography
            className={classes.subHeader}
            variant="headline"
            component="h4">
            CORS Config #{index + 1}
          </Typography>
          <IconButton onClick={() => fields.remove(index)}>
            <DeleteIcon />
          </IconButton>
        </div>
        <div className="flex-column">
          <FieldArray name={`${member}.origin`} component={CorsOriginList} />
          <FormControl className={classes.field}>
            <InputLabel htmlFor="method">HTTP Methods To Include</InputLabel>
            <Field
              name={`${member}.method`}
              component={Select}
              format={value => (Array.isArray(value) ? value : [])}
              fullWidth
              multiple
              inputProps={{
                name: 'method',
                id: 'method'
              }}>
              {methods.map(name => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Field>
          </FormControl>
          <Field
            name={`${member}.maxAgeSeconds`}
            type="number"
            component={TextField}
            label="Max Age (in seconds)"
          />
        </div>
      </div>
    ))}
    <div className={classes.add}>
      <Button color="primary" onClick={() => fields.push({ origin: [''] })}>
        Add CORS Config
      </Button>
      {submitFailed && error && <span>{error}</span>}
    </div>
  </div>
)

CorsList.propTypes = {
  fields: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired
}

export default CorsList
