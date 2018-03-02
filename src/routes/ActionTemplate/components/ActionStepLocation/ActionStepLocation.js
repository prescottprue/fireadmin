import React from 'react'
import PropTypes from 'prop-types'
import { capitalize, get } from 'lodash'
import { Field } from 'redux-form'
import { TextField, Select, RadioGroup } from 'redux-form-material-ui'
import { FormControl, FormControlLabel, FormLabel } from 'material-ui/Form'
import { InputLabel } from 'material-ui/Input'
import Radio from 'material-ui/Radio'
import { ListItemText } from 'material-ui/List'
import { MenuItem } from 'material-ui/Menu'
import Grid from 'material-ui/Grid'
import classes from './ActionStepLocation.scss'

// const pathTypeOptions = [{ value: 'only' }, { value: 'all but' }]
const resourcesOptions = [
  { value: 'rtdb', label: 'Real Time Database' },
  { value: 'firestore' },
  { value: 'storage', label: 'Cloud Storage' }
]

export const ActionStepLocation = ({
  name,
  inputs,
  indexName,
  steps,
  title
}) => (
  <Grid item xs={12} lg={6}>
    <h4>{title}</h4>
    <FormControl className={classes.field}>
      <InputLabel htmlFor="resource">Select A Resource</InputLabel>
      <Field
        name={`${name}.resource`}
        component={Select}
        fullWidth
        inputProps={{
          name: 'resource',
          id: 'resource'
        }}>
        {resourcesOptions.map((option, idx) => (
          <MenuItem
            key={`Option-${option.value}-${idx}`}
            value={option.value}
            disabled={option.disabled}>
            <ListItemText primary={option.label || capitalize(option.value)} />
          </MenuItem>
        ))}
      </Field>
    </FormControl>
    <FormControl
      component="fieldset"
      required
      className={classes.formControl}
      style={{ marginTop: '2rem' }}>
      <FormLabel component="legend">Path Type</FormLabel>
      <Field component={RadioGroup} name={`${name}.pathType`}>
        <FormControlLabel
          value="constant"
          control={<Radio />}
          label="Constant (part of template)"
        />
        <FormControlLabel
          value="input"
          control={<Radio />}
          label="User Input"
        />
      </Field>
    </FormControl>
    {get(steps, `${indexName}.pathType`) === 'input' ? (
      <FormControl className={classes.field}>
        <InputLabel htmlFor="resource">Select An Input</InputLabel>
        <Field
          name={`${name}.path`}
          component={Select}
          fullWidth
          inputProps={{
            name: 'pathType',
            id: 'pathType'
          }}>
          {inputs.map((option, idx) => (
            <MenuItem
              key={`Option-${option.value}-${idx}`}
              value={idx}
              disabled={option.disabled}>
              <ListItemText
                primary={get(option, 'name', `Input ${idx}`)}
                secondary={get(option, 'variableName', `Input ${idx}`)}
              />
            </MenuItem>
          ))}
        </Field>
      </FormControl>
    ) : (
      <Field
        name={`${name}.path`}
        component={TextField}
        label="Path"
        className={classes.field}
      />
    )}
  </Grid>
)

ActionStepLocation.propTypes = {
  steps: PropTypes.array,
  inputs: PropTypes.array,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  indexName: PropTypes.string.isRequired
}

export default ActionStepLocation
