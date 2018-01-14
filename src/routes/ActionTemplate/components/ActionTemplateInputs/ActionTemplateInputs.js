import React from 'react'
import PropTypes from 'prop-types'
import { capitalize, get } from 'lodash'
import { Field } from 'redux-form'
import { SelectField } from 'redux-form-material-ui'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from 'material-ui-next/ExpansionPanel'
import Typography from 'material-ui-next/Typography'
import MenuItem from 'material-ui/MenuItem'
import Button from 'material-ui-next/Button'
import Grid from 'material-ui-next/Grid'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
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
      onClick={() => fields.push({ type: 'copy' })}
      color="primary"
      className={classes.addAction}>
      Add Input
    </Button>
    {fields.map((member, index, field) => (
      <ExpansionPanel key={index}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.title}>Input {index + 1}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container spacing={24} style={{ flexGrow: 1 }}>
            <Grid item xs={12} lg={6}>
              <Field
                name={`${member}.type`}
                component={SelectField}
                hintText="Select An Input Type"
                floatingLabelText="Resource"
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
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    ))}
  </div>
)

ActionTemplateInputs.propTypes = {
  fields: PropTypes.object.isRequired,
  inputs: PropTypes.array
}

export default ActionTemplateInputs
