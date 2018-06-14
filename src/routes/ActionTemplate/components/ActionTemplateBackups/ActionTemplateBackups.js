import React from 'react'
import PropTypes from 'prop-types'
import { capitalize } from 'lodash'
import { Field } from 'redux-form'
import { TextField, Select } from 'redux-form-material-ui'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DeleteIcon from '@material-ui/icons/Delete'
import classes from './ActionTemplateBackups.scss'

// const pathTypeOptions = [{ value: 'only' }, { value: 'all but' }]
const resourcesOptions = [
  { value: 'rtdb', label: 'Real Time Database' },
  { value: 'firestore' },
  { value: 'storage', label: 'Cloud Storage' }
]

export const ActionTemplateBackups = ({ fields, steps }) => (
  <div>
    <Button
      onClick={() => fields.push({ dest: { resource: 'firestore' } })}
      color="primary"
      className={classes.addAction}
      variant="raised">
      Add Backup
    </Button>
    {fields.map((member, index, field) => (
      <ExpansionPanel key={index}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.title}>
            {fields.get(index).name || fields.get(index).type || 'No Name'}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid constainer spacing={24} style={{ flexGrow: 1 }}>
            <Grid item xs={12} lg={6}>
              <Field
                name={`${member}.name`}
                component={TextField}
                label="Name"
                className={classes.field}
              />
              <Field
                name={`${member}.description`}
                component={TextField}
                label="Description"
                className={classes.field}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <IconButton
                onClick={() => fields.remove(index)}
                color="secondary"
                className={classes.submit}>
                <DeleteIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12} lg={6}>
              <div className={classes.sections}>
                <div className="flex-column">
                  <h4>Source</h4>
                  <FormControl className={classes.field}>
                    <InputLabel htmlFor="resource">Select Resource</InputLabel>
                    <Field
                      name={`${member}.inputs.0.resource`}
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
                  <Field
                    name={`${member}.inputs.0.path`}
                    component={TextField}
                    label="Path"
                    className={classes.field}
                  />
                </div>
              </div>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    ))}
  </div>
)

ActionTemplateBackups.propTypes = {
  fields: PropTypes.object.isRequired,
  steps: PropTypes.array
}

export default ActionTemplateBackups
