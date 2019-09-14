import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { map, capitalize } from 'lodash'
import { Select } from 'redux-form-material-ui'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import OutlinedSelect from 'components/OutlinedSelect'
import { databaseURLToProjectName } from 'utils'
import { RESOURCE_OPTIONS } from 'constants'
import Grid from '@material-ui/core/Grid'

function DataViewerSetupForm({ classes, environments, handleSubmit }) {
  return (
    <div className={classes.root}>
      <Grid container justify="center">
        <Grid item xs={12} md={4}>
          <Field
            name="environment"
            component={OutlinedSelect}
            fullWidth
            props={{
              label: 'Environment'
            }}
            inputProps={{
              name: 'environment',
              id: 'environment',
              'data-test': 'environment-select'
            }}>
            {map(environments, (environment, envIndex) => (
              <MenuItem
                key={`Environment-Option-${environment.id}-${envIndex}`}
                value={environment.id}
                button
                disabled={environment.locked}
                data-test={`environment-option-${environment.id}`}>
                <ListItemText
                  primary={environment.name || environment.id}
                  secondary={`${databaseURLToProjectName(
                    environment.databaseURL
                  )}${environment.locked ? ' - Locked' : ''}${
                    environment.readOnly ? ' - Read Only' : ''
                  }${environment.writeOnly ? ' - Write Only' : ''}`}
                />
              </MenuItem>
            ))}
          </Field>
        </Grid>
        <Grid item md={4}>
          <FormControl style={{ width: '100%' }}>
            <InputLabel htmlFor="resource">Select Resource</InputLabel>
            <Field
              name="resource"
              component={Select}
              fullWidth
              inputProps={{
                name: 'resource',
                id: 'resource'
              }}>
              {RESOURCE_OPTIONS.map((option, idx) => (
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
        <Grid container justify="center">
          <Grid item md={2}>
            <Button type="submit" onClick={handleSubmit}>
              Start Data Viewer
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

DataViewerSetupForm.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  environments: PropTypes.array.isRequired // from enhancer (reduxForm)
}

export default DataViewerSetupForm
