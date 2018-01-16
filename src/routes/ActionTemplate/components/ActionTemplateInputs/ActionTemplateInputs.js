import React from 'react'
import PropTypes from 'prop-types'
import { capitalize, get, startCase } from 'lodash'
import { Field } from 'redux-form'
import { SelectField, TextField, Toggle } from 'redux-form-material-ui'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from 'material-ui-next/ExpansionPanel'
import Typography from 'material-ui-next/Typography'
import MenuItem from 'material-ui/MenuItem'
import Button from 'material-ui-next/Button'
import Grid from 'material-ui-next/Grid'
import Tooltip from 'material-ui-next/Tooltip'
import Divider from 'material-ui-next/Divider'
import IconButton from 'material-ui-next/IconButton'
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
      raised
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
                floatingLabelText="Name"
                className={classes.field}
              />
              <Field
                name={`${member}.description`}
                component={TextField}
                floatingLabelText="Description"
                className={classes.field}
              />
              <div className={classes.required}>
                <Field
                  name={`${member}.required`}
                  component={Toggle}
                  label="Required"
                />
              </div>
            </Grid>
            <Grid item xs={12} lg={3}>
              <Field
                name={`${member}.type`}
                component={SelectField}
                hintText="Select An Input Type"
                floatingLabelText="Input Type"
                className={classes.field}>
                {inputTypes.map((option, idx) => (
                  <MenuItem
                    key={`Option-${option.value}-${idx}`}
                    value={option.value}
                    primaryText={option.label || capitalize(option.value)}
                    disabled={option.disabled}
                  />
                ))}
              </Field>
              {get(inputs, `${index}.type`) === 'serviceAccount' ? (
                <Field
                  name={`${member}.resource`}
                  component={SelectField}
                  hintText="Select A Source Resource"
                  floatingLabelText="Source Resource"
                  className={classes.field}>
                  {resourcesOptions.map((option, idx) => (
                    <MenuItem
                      key={`Option-${option.value}-${idx}`}
                      value={option.value}
                      primaryText={option.label || capitalize(option.value)}
                      disabled={option.disabled}
                    />
                  ))}
                </Field>
              ) : null}
            </Grid>
            <Grid item xs={6} lg={2}>
              <Field
                name={`${member}.variableName`}
                component={TextField}
                floatingLabelText="Variable Name"
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
