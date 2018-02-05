import React from 'react'
import PropTypes from 'prop-types'
import { capitalize } from 'lodash'
import { Field } from 'redux-form'
import { TextField, Select } from 'redux-form-material-ui'
import { FormControl } from 'material-ui/Form'
import { InputLabel } from 'material-ui/Input'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from 'material-ui/ExpansionPanel'
import Typography from 'material-ui/Typography'
import { ListItemText } from 'material-ui/List'
import { MenuItem } from 'material-ui/Menu'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import Grid from 'material-ui/Grid'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import DeleteIcon from 'material-ui-icons/Delete'
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
      onClick={() => fields.push({ dest: { resource: 'storage' } })}
      color="primary"
      className={classes.addAction}>
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
          <Grid container spacing={24} style={{ flexGrow: 1 }}>
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
                      format={value => (Array.isArray(value) ? value : [])}
                      fullWidth
                      multiple
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
