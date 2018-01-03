import React from 'react'
import PropTypes from 'prop-types'
import { capitalize } from 'lodash'
import { Field } from 'redux-form'
import { TextField, SelectField } from 'redux-form-material-ui'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from 'material-ui-next/ExpansionPanel'
import Typography from 'material-ui-next/Typography'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui-next/IconButton'
import Button from 'material-ui-next/Button'
import Grid from 'material-ui-next/Grid'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import DeleteIcon from 'material-ui-icons/Delete'
import MigrationEditor from '../MigrationEditor'
import classes from './MigrationTemplateAction.scss'

const typeOptions = [
  { value: 'copy' },
  { value: 'map', disabled: true },
  { value: 'delete', disabled: true },
  { value: 'custom' }
]
// const pathTypeOptions = [{ value: 'only' }, { value: 'all but' }]
const resourcesOptions = [
  { value: 'rtdb', label: 'Real Time Database' },
  { value: 'firestore' },
  { value: 'storage', label: 'Cloud Storage' }
]

export const MigrationTemplateAction = ({ fields, mainEditorPath }) => (
  <div>
    <Button
      raised
      onClick={() => fields.push({ type: 'copy' })}
      color="primary"
      className={classes.addAction}>
      Add Action
    </Button>
    {fields.map((member, index, field) => (
      <ExpansionPanel key={index}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.title}>
            {fields.get(index).name || fields.get(index).type}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container spacing={24} style={{ flexGrow: 1 }}>
            <Grid item xs={12} lg={6}>
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
            </Grid>
            <Grid item xs={12} lg={6}>
              <IconButton
                onClick={() => fields.remove(index)}
                color="accent"
                className={classes.submit}>
                <DeleteIcon />
              </IconButton>
              <Field
                name={`${member}.type`}
                component={SelectField}
                hintText="Select An Action Type"
                floatingLabelText="Action Type">
                {typeOptions.map((option, idx) => (
                  <MenuItem
                    key={`Option-${option.value}-${idx}`}
                    value={option.value}
                    primaryText={option.label || capitalize(option.value)}
                    disabled={option.disabled}
                  />
                ))}
              </Field>
            </Grid>
            {fields.get(index).type !== 'custom' ? (
              <Grid item xs={12} lg={3}>
                <h4>Source</h4>
                <Field
                  name={`${member}.src.resource`}
                  component={SelectField}
                  hintText="Select A Resource"
                  floatingLabelText="Resource"
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
                <Field
                  name={`${member}.src.path`}
                  component={TextField}
                  floatingLabelText="Path"
                  className={classes.field}
                />
                {/* <Field
                  name={`${member}.src.pathType`}
                  component={SelectField}
                  hintText="Select A Path Type"
                  floatingLabelText="Path Type"
                  className={classes.field}>
                  {pathTypeOptions.map((option, idx) => (
                    <MenuItem
                      key={`Option-${option.value}-${idx}`}
                      value={option.value}
                      primaryText={option.label || capitalize(option.value)}
                      disabled={option.disabled}
                    />
                  ))}
                </Field> */}
                <h4>Destination</h4>
                <Field
                  name={`${member}.dest.resource`}
                  component={SelectField}
                  hintText="Select A Resource"
                  floatingLabelText="Resource"
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
                <Field
                  name={`${member}.dest.path`}
                  component={TextField}
                  floatingLabelText="Path"
                  className={classes.field}
                />
              </Grid>
            ) : (
              <MigrationEditor
                rtdbPath={`${mainEditorPath}/actions/${index}`}
              />
            )}
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    ))}
  </div>
)

MigrationTemplateAction.propTypes = {
  fields: PropTypes.object.isRequired,
  mainEditorPath: PropTypes.string.isRequired
}

export default MigrationTemplateAction
