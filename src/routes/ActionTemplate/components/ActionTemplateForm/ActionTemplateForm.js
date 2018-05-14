import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import { Field, FieldArray } from 'redux-form'
import { TextField, Switch } from 'redux-form-material-ui'
import { FormControlLabel } from 'material-ui/Form'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Grid from 'material-ui/Grid'
import Tooltip from 'material-ui/Tooltip'
import ActionTemplateStep from '../ActionTemplateStep'
import ActionTemplateInputs from '../ActionTemplateInputs'
import ActionTemplateEnvs from '../ActionTemplateEnvs'
import ActionTemplateBackups from '../ActionTemplateBackups'
// import LoadIntoProjectButton from '../LoadIntoProjectButton'
import DeleteIcon from 'material-ui-icons/Delete'
import PublishIcon from 'material-ui-icons/Publish'
import UndoIcon from 'material-ui-icons/Undo'
import { firebasePaths } from 'constants'
import styleClasses from './ActionTemplateForm.scss'

export const ActionTemplateForm = ({
  submitting,
  pristine,
  reset,
  classes,
  handleSubmit,
  templateId,
  editable,
  submitTooltip,
  deleteTooltip,
  cancelTooltip,
  startTemplateDelete
}) => (
  <form className={styleClasses.container} onSubmit={handleSubmit}>
    <div className={styleClasses.buttons}>
      {cancelTooltip ? (
        <Tooltip placement="bottom" title={cancelTooltip}>
          <div>
            <Button
              disabled={pristine || submitting}
              onClick={reset}
              variant="fab"
              color="secondary"
              className={classes.button}>
              <UndoIcon />
            </Button>
          </div>
        </Tooltip>
      ) : (
        <Button variant="fab" disabled className={classes.button}>
          <UndoIcon />
        </Button>
      )}
      {submitTooltip ? (
        <Tooltip placement="bottom" title={submitTooltip}>
          <div>
            <Button
              type="submit"
              variant="fab"
              disabled={!editable || submitting || pristine}
              color="primary"
              className={classes.button}>
              <PublishIcon />
            </Button>
          </div>
        </Tooltip>
      ) : (
        <Button variant="fab" disabled className={classes.button}>
          <PublishIcon />
        </Button>
      )}
      {/* <LoadIntoProjectButton templateId={templateId} /> */}
      {deleteTooltip ? (
        <Tooltip placement="bottom" title={deleteTooltip}>
          <div>
            <Button
              onClick={startTemplateDelete}
              disabled={!editable}
              variant="fab"
              color="secondary"
              className={classes.button}>
              <DeleteIcon />
            </Button>
          </div>
        </Tooltip>
      ) : (
        <Button variant="fab" disabled className={classes.button}>
          <DeleteIcon />
        </Button>
      )}
    </div>
    <Typography className={styleClasses.header}>Meta Data</Typography>
    <Paper className={styleClasses.paper}>
      <Grid container spacing={24}>
        <Grid item xs>
          <Field
            name="name"
            component={TextField}
            label="Name"
            className={styleClasses.field}
          />
          <Field
            name="description"
            component={TextField}
            className={styleClasses.field}
            label="Description"
          />
          <div className={styleClasses.publicToggle}>
            <FormControlLabel
              control={<Field name="name" component={Switch} />}
              label="Public"
            />
          </div>
        </Grid>
      </Grid>
    </Paper>
    <div className={styleClasses.actions}>
      <Typography className={styleClasses.header}>Environments</Typography>
      <FieldArray name="environments" component={ActionTemplateEnvs} />
    </div>
    <div className={styleClasses.actions}>
      <Typography className={styleClasses.header}>Inputs</Typography>
      <FieldArray name="inputs" component={ActionTemplateInputs} />
    </div>
    <div className={styleClasses.actions}>
      <Typography className={styleClasses.header}>Backups</Typography>
      <FieldArray name="backups" component={ActionTemplateBackups} />
    </div>
    <div className={styleClasses.actions}>
      <Typography className={styleClasses.header}>Steps</Typography>
      <FieldArray
        name="steps"
        mainEditorPath={`${firebasePaths.actionTemplates}/${templateId}`}
        component={ActionTemplateStep}
      />
    </div>
  </form>
)

ActionTemplateForm.propTypes = {
  templateId: PropTypes.string.isRequired,
  startTemplateDelete: PropTypes.func,
  submitting: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  reset: PropTypes.func.isRequired, // from enhancer (reduxForm)
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  editable: PropTypes.bool.isRequired, // from enhancer (connect)
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  submitTooltip: PropTypes.string, // from enhancer (withProps)
  deleteTooltip: PropTypes.string, // from enhancer (withProps)
  cancelTooltip: PropTypes.string // from enhancer (withProps)
}

export default ActionTemplateForm
