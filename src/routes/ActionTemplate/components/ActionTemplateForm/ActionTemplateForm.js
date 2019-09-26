import React from 'react'
import PropTypes from 'prop-types'
import { Field, FieldArray } from 'redux-form'
import { Link } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import PublishIcon from '@material-ui/icons/Publish'
import BackIcon from '@material-ui/icons/ArrowBack'
import UndoIcon from '@material-ui/icons/Undo'
import IconButton from '@material-ui/core/IconButton'
import TextField from 'components/FormTextField'
import { makeStyles } from '@material-ui/core/styles'
import { ACTION_TEMPLATES_PATH } from 'constants/firebasePaths'
import ActionTemplateStep from '../ActionTemplateStep'
import ActionTemplateInputs from '../ActionTemplateInputs'
import ActionTemplateEnvs from '../ActionTemplateEnvs'
import ActionTemplateBackups from '../ActionTemplateBackups'
import styles from './ActionTemplateForm.styles'
import FormSwitchField from 'components/FormSwitchField'

const useStyles = makeStyles(styles)

function ActionTemplateForm({
  submitting,
  pristine,
  reset,
  handleSubmit,
  templateId,
  editable,
  submitTooltip,
  deleteTooltip,
  cancelTooltip,
  startTemplateDelete,
  goBack
}) {
  const classes = useStyles()

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <div className={classes.buttons}>
        <div style={{ marginRight: '4rem' }}>
          <Tooltip placement="bottom" title="Back To Templates">
            <IconButton
              className={classes.submit}
              component={Link}
              to={ACTION_TEMPLATES_PATH}
              onClick={goBack}>
              <BackIcon />
            </IconButton>
          </Tooltip>
        </div>
        <Tooltip placement="bottom" title={cancelTooltip}>
          <div>
            <Fab
              disabled={pristine || submitting}
              onClick={reset}
              color="secondary"
              className={classes.button}>
              <UndoIcon />
            </Fab>
          </div>
        </Tooltip>
        <Tooltip placement="bottom" title={submitTooltip}>
          <div>
            <Fab
              type="submit"
              disabled={!editable || submitting || pristine}
              color="primary"
              className={classes.button}>
              <PublishIcon />
            </Fab>
          </div>
        </Tooltip>
        {/* TODO: Add a button/select for running this template in a project */}
        <Tooltip placement="bottom" title={deleteTooltip}>
          <div>
            <Fab
              onClick={startTemplateDelete}
              disabled={!editable}
              color="secondary"
              className={classes.button}>
              <DeleteIcon />
            </Fab>
          </div>
        </Tooltip>
      </div>
      <Typography className={classes.header}>Meta Data</Typography>
      <Paper className={classes.paper}>
        <Grid container spacing={8}>
          <Grid item xs={10} md={6}>
            <Field
              name="name"
              component={TextField}
              label="Name"
              className={classes.field}
              fullWidth
            />
          </Grid>
          <Grid item xs={10} md={6}>
            <Field
              name="description"
              component={TextField}
              className={classes.field}
              label="Description"
              fullWidth
              multiline
            />
          </Grid>
          <Grid item xs={10} md={6}>
            <div className={classes.publicToggle}>
              <Field name="public" label="public" component={FormSwitchField} />
            </div>
          </Grid>
        </Grid>
      </Paper>
      <div className={classes.actions}>
        <Typography className={classes.header}>Environments</Typography>
        <FieldArray name="environments" component={ActionTemplateEnvs} />
      </div>
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
          mainEditorPath={`${ACTION_TEMPLATES_PATH}/${templateId}`}
          component={ActionTemplateStep}
        />
      </div>
    </form>
  )
}

ActionTemplateForm.propTypes = {
  templateId: PropTypes.string.isRequired,
  startTemplateDelete: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired, // from enhancer (withHandlers)
  submitting: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  reset: PropTypes.func.isRequired, // from enhancer (reduxForm)
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  editable: PropTypes.bool.isRequired, // from enhancer (connect)
  submitTooltip: PropTypes.string, // from enhancer (withProps)
  deleteTooltip: PropTypes.string, // from enhancer (withProps)
  cancelTooltip: PropTypes.string // from enhancer (withProps)
}

export default ActionTemplateForm
