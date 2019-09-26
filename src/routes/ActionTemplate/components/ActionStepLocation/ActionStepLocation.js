import React from 'react'
import PropTypes from 'prop-types'
import { capitalize, get } from 'lodash'
import { Field } from 'redux-form'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Select from 'components/FormSelectField'
import TextField from 'components/FormTextField'
import styles from './ActionStepLocation.styles'
import FormRadioGroupField from 'components/FormRadioGroupField'

const useStyles = makeStyles(styles)

// const pathTypeOptions = [{ value: 'only' }, { value: 'all but' }]
const resourcesOptions = [
  { value: 'rtdb', label: 'Real Time Database' },
  { value: 'firestore' },
  { value: 'storage', label: 'Cloud Storage' }
]

function ActionStepLocation({ name, inputs, indexName, steps, title }) {
  const classes = useStyles()

  return (
    <Grid item xs={12} md={8} lg={6}>
      <Typography variant="h4">{title}</Typography>
      <Grid container spacing={8}>
        <Grid item xs={12} md={8}>
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
                  <ListItemText
                    primary={option.label || capitalize(option.value)}
                  />
                </MenuItem>
              ))}
            </Field>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={8}>
          <FormControl
            component="fieldset"
            required
            style={{ marginTop: '2rem' }}>
            <FormLabel component="legend">Path Type</FormLabel>
            <Field
              component={FormRadioGroupField}
              options={[
                { value: 'constant', label: 'Constant (part of template)' },
                { value: 'input', label: 'User Input' }
              ]}
              name={`${name}.pathType`}
            />
          </FormControl>
        </Grid>
        {get(steps, `${indexName}.pathType`) === 'input' ? (
          <Grid item xs={12} md={8}>
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
          </Grid>
        ) : (
          <Grid item xs={12} md={8}>
            <Field
              name={`${name}.path`}
              component={TextField}
              label="Path"
              className={classes.field}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

ActionStepLocation.propTypes = {
  steps: PropTypes.array,
  inputs: PropTypes.array,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  indexName: PropTypes.string.isRequired
}

export default ActionStepLocation
