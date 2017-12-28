import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui-next/Paper'
import { capitalize } from 'lodash'
import { Field, FieldArray } from 'redux-form'
import { TextField, Toggle, SelectField } from 'redux-form-material-ui'
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
import classes from './MigrationTemplateForm.scss'

const typeOptions = [{ value: 'copy' }, { value: 'map' }, { value: 'delete' }]
const pathTypeOptions = [{ value: 'only' }, { value: 'all but' }]
const resourcesOptions = [
  { value: 'rtdb', label: 'Real Time Database' },
  { value: 'firestore' },
  { value: 'storage', label: 'Cloud Storage' }
]

const renderSubFields = (member, index, fields) => (
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
          <Field
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
          </Field>
        </Grid>
        <Grid item xs={12} lg={3}>
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
      </Grid>
    </ExpansionPanelDetails>
  </ExpansionPanel>
)

const renderAction = ({ fields }) => (
  <div>
    <Button
      raised
      onClick={() => fields.push({ type: 'copy' })}
      color="primary"
      className={classes.addAction}>
      Add Action
    </Button>
    {fields.map(renderSubFields)}
  </div>
)

renderAction.propTypes = {
  fields: PropTypes.object.isRequired
}

export const MigrationTemplateForm = ({
  submitting,
  pristine,
  reset,
  handleSubmit
}) => (
  <form className={classes.container} onSubmit={handleSubmit}>
    <div className={classes.buttons}>
      <Button
        disabled={pristine || submitting}
        color="accent"
        onTouchTap={reset}>
        Cancel
      </Button>
      <Button
        raised
        disabled={submitting || pristine}
        color="primary"
        type="submit"
        className={classes.submit}>
        Save
      </Button>
    </div>
    <Typography className={classes.header}>Meta Data</Typography>
    <Paper className={classes.paper}>
      <Grid container spacing={24}>
        <Grid item xs>
          <Field
            name="name"
            component={TextField}
            floatingLabelText="Name"
            className={classes.field}
          />
          <Field
            name="description"
            component={TextField}
            className={classes.field}
            floatingLabelText="Description"
          />
          <Field
            name="tags"
            component={TextField}
            disabled
            floatingLabelText="Tags (seperated by commas)"
          />
        </Grid>
        <Grid item xs>
          <div style={{ maxWidth: '5rem' }}>
            <Field name="public" component={Toggle} label="Public" />
          </div>
        </Grid>
      </Grid>
    </Paper>
    <div className={classes.actions}>
      <Typography className={classes.header}>Actions</Typography>
      <FieldArray name="actions" component={renderAction} />
    </div>
  </form>
)

MigrationTemplateForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired
}

export default MigrationTemplateForm
