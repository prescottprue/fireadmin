import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import { Field, FieldArray } from 'redux-form'
import { TextField, Switch } from 'redux-form-material-ui'
import { FormControlLabel } from 'material-ui/Form'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import Grid from 'material-ui/Grid'
import ActionTemplateStep from '../ActionTemplateStep'
import ActionTemplateInputs from '../ActionTemplateInputs'
import ActionTemplateBackups from '../ActionTemplateBackups'
import DeleteIcon from 'material-ui-icons/Delete'
import { firebasePaths } from 'constants'
import classes from './ActionTemplateForm.scss'

export const ActionTemplateForm = ({
  submitting,
  pristine,
  reset,
  handleSubmit,
  templateId,
  startTemplateDelete
}) => (
  <form className={classes.container} onSubmit={handleSubmit}>
    <div className={classes.buttons}>
      <Button
        disabled={pristine || submitting}
        color="secondary"
        onTouchTap={reset}
        variant="raised"
        style={{ marginRight: '2rem' }}>
        Cancel
      </Button>
      <Button
        disabled={submitting || pristine}
        color="primary"
        type="submit"
        variant="raised"
        className={classes.submit}>
        Save
      </Button>
      <IconButton
        onClick={startTemplateDelete}
        color="secondary"
        className={classes.submit}>
        <DeleteIcon />
      </IconButton>
    </div>
    <Typography className={classes.header}>Meta Data</Typography>
    <Paper className={classes.paper}>
      <Grid container spacing={24}>
        <Grid item xs>
          <Field
            name="name"
            component={TextField}
            label="Name"
            className={classes.field}
          />
          <Field
            name="description"
            component={TextField}
            className={classes.field}
            label="Description"
          />
          <div className={classes.publicToggle}>
            <FormControlLabel
              control={<Field name="name" component={Switch} />}
              label="Public"
            />
          </div>
        </Grid>
      </Grid>
    </Paper>
    <div className={classes.actions}>
      <Typography className={classes.header}>Inputs</Typography>
      <FieldArray name="inputs" component={ActionTemplateInputs} />
    </div>
    <div className={classes.actions}>
      <Typography className={classes.header}>Backups</Typography>
      <FieldArray name="backups" component={ActionTemplateBackups} />
    </div>
    <div className={classes.actions}>
      <Typography className={classes.header}>Steps</Typography>
      <FieldArray
        name="steps"
        mainEditorPath={`${firebasePaths.actionTemplates}/${templateId}`}
        component={ActionTemplateStep}
      />
    </div>
  </form>
)

ActionTemplateForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  templateId: PropTypes.string.isRequired,
  startTemplateDelete: PropTypes.func,
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired
}

export default ActionTemplateForm
