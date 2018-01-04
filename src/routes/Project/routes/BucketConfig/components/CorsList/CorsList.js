import React from 'react'
import PropTypes from 'prop-types'
import classes from './CorsList.scss'
import IconButton from 'material-ui-next/IconButton'
import { TextField, SelectField } from 'redux-form-material-ui'
import Button from 'material-ui-next/Button'
import MenuItem from 'material-ui/MenuItem'
import { Field, FieldArray } from 'redux-form'
import DeleteIcon from 'material-ui-icons/Delete'
import CorsOriginList from '../CorsOriginList'
import Paper from 'material-ui-next/Paper'

const methods = ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']

export const CorsList = ({ fields, meta: { error, submitFailed } }) => (
  <div>
    {fields.map((member, index) => (
      <Paper key={index} className={classes.item}>
        <div className="flex-row">
          <h4>CORS Config #{index + 1}</h4>
          <IconButton onClick={() => fields.remove(index)}>
            <DeleteIcon />
          </IconButton>
        </div>
        <div className="flex-column">
          <FieldArray name={`${member}.origin`} component={CorsOriginList} />
          <div className="flex-column">
            <Field
              name={`${member}.method`}
              component={SelectField}
              floatingLabelText="HTTP Methods to Include"
              multiple>
              {methods.map(name => (
                <MenuItem key={name} value={name} primaryText={name} />
              ))}
            </Field>
          </div>
          <Field
            name={`${member}.maxAgeSeconds`}
            type="number"
            component={TextField}
            floatingLabelText="Max Age (in seconds)"
          />
        </div>
      </Paper>
    ))}
    <div className={classes.add}>
      <Button
        raised
        color="primary"
        onClick={() => fields.push({ origin: [''] })}>
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
