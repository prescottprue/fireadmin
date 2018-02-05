import React from 'react'
import PropTypes from 'prop-types'
import { capitalize, get, startCase } from 'lodash'
import { Field } from 'redux-form'
import { Select, TextField, Switch } from 'redux-form-material-ui'
import { FormControl, FormControlLabel } from 'material-ui/Form'
import { InputLabel } from 'material-ui/Input'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from 'material-ui/ExpansionPanel'
import Typography from 'material-ui/Typography'
import { ListItemText } from 'material-ui/List'
import { MenuItem } from 'material-ui/Menu'
import Button from 'material-ui/Button'
import Grid from 'material-ui/Grid'
import Tooltip from 'material-ui/Tooltip'
import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import DeleteIcon from 'material-ui-icons/Delete'
import classes from './ActionTemplateInputs.scss'

const inputTypes = [
  { value: 'serviceAccount', label: 'Service Account' },
  { value: 'userInput', label: 'User Input' }
]

const resourcesOptions = [
  { value: 'rtdb', label: 'Real Time Database' },
  { value: 'firestore' },
  { value: 'storage', label: 'Cloud Storage' }
]

export const ActionTemplateInputs = ({ fields, inputs }) => (
  <div>
    <Button
      onClick={() => fields.push({ type: 'serviceAccount' })}
      color="primary"
      className={classes.addAction}>
      Add Input
    </Button>
    {fields.map((member, index, field) => (
      <ExpansionPanel key={index}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.title}>
            {get(inputs, `${index}.name`) || `Input ${index + 1}`}
          </Typography>
          {get(inputs, `${index}.type`, null) && (
            <Typography className={classes.type}>
              Type: {startCase(get(inputs, `${index}.type`))}
            </Typography>
          )}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container spacing={24} style={{ flexGrow: 1 }}>
            <Grid item xs={12} lg={3}>
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
              <div className={classes.required}>
                <FormControlLabel
                  control={
                    <Field name={`${member}.required`} component={Switch} />
                  }
                  label="Required"
                />
              </div>
            </Grid>
            <Grid item xs={12} lg={3}>
              <FormControl className={classes.field}>
                <InputLabel htmlFor="inputType">
                  Select An Input Type
                </InputLabel>
                <Field
                  name={`${member}.type`}
                  component={Select}
                  fullWidth
                  inputProps={{
                    name: 'inputType',
                    id: 'inputType'
                  }}>
                  {inputTypes.map((option, idx) => (
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
              {get(inputs, `${index}.type`) === 'serviceAccount' ? (
                <FormControl className={classes.field}>
                  <InputLabel htmlFor="resource">Select Resource</InputLabel>
                  <Field
                    name={`${member}.resource`}
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
              ) : null}
            </Grid>
            <Grid item xs={6} lg={2}>
              <Field
                name={`${member}.variableName`}
                component={TextField}
                label="Variable Name"
                className={classes.field}
              />
              <Tooltip placement="bottom" title="Remove Input">
                <IconButton
                  onClick={() => fields.remove(index)}
                  className={classes.delete}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
        <Divider />
      </ExpansionPanel>
    ))}
  </div>
)

ActionTemplateInputs.propTypes = {
  fields: PropTypes.object.isRequired,
  inputs: PropTypes.array
}

export default ActionTemplateInputs
