import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui-next/Paper'
import { Field, FieldArray } from 'redux-form'
import { TextField, Toggle } from 'redux-form-material-ui'
import Typography from 'material-ui-next/Typography'
import IconButton from 'material-ui-next/IconButton'
import Button from 'material-ui-next/Button'
import Grid from 'material-ui-next/Grid'
import ActionTemplateStep from '../ActionTemplateStep'
import ActionTemplateInputs from '../ActionTemplateInputs'
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
      <IconButton
        onClick={startTemplateDelete}
        color="accent"
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
      <Typography className={classes.header}>Inputs</Typography>
      <FieldArray name="inputs" component={ActionTemplateInputs} />
    </div>
    <div className={classes.actions}>
      <Typography className={classes.header}>Actions</Typography>
      <FieldArray
        name="steps"
        mainEditorPath={`${firebasePaths.migrationTemplates}/${templateId}`}
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
