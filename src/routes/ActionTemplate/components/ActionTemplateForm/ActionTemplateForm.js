import React from 'react'
import PropTypes from 'prop-types'
import { Link, useHistory } from 'react-router-dom'
import { useForm, FormContext } from 'react-hook-form'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import PublishIcon from '@material-ui/icons/Publish'
import BackIcon from '@material-ui/icons/ArrowBack'
import UndoIcon from '@material-ui/icons/Undo'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Switch from '@material-ui/core/Switch'
import { makeStyles } from '@material-ui/core/styles'
import { ACTION_TEMPLATES_PATH } from 'constants/paths'
// import ActionTemplateStep from '../ActionTemplateStep'
import ActionTemplateInputs from '../ActionTemplateInputs'
import ActionTemplateEnvs from '../ActionTemplateEnvs'
import ActionTemplateBackups from '../ActionTemplateBackups'
import styles from './ActionTemplateForm.styles'

const useStyles = makeStyles(styles)

function ActionTemplateForm({
  onSubmit,
  templateId,
  defaultValues,
  editable,
  startTemplateDelete
}) {
  const classes = useStyles()
  const methods = useForm({ defaultValues })
  const history = useHistory()
  const {
    register,
    handleSubmit,
    errors,
    reset,
    formState: { isSubmitting, dirty }
  } = methods

  const submitTooltip = !editable
    ? 'Must be owner'
    : !!dirty && !isSubmitting
    ? 'Save Template'
    : 'Nothing to publish'
  const cancelTooltip = !dirty || isSubmitting ? 'Nothing to undo' : 'Undo'
  const deleteTooltip = editable ? 'Delete Template' : 'Must be owner'
  const goBack = () => history.push(ACTION_TEMPLATES_PATH)
  return (
    <FormContext {...methods}>
      <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
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
                disabled={!dirty || isSubmitting}
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
                disabled={!editable || isSubmitting || !dirty}
                color="primary"
                className={classes.button}
                data-test="publish-action-template">
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
              <TextField
                name="name"
                label="Template Name"
                margin="normal"
                inputRef={register}
                fullWidth
              />
            </Grid>
            <Grid item xs={10} md={6}>
              <TextField
                name="description"
                label="Description"
                className={classes.field}
                fullWidth
                inputRef={register({
                  maxLength: 500
                })}
                error={!!errors.description}
                helperText={errors.description && 'Email must be valid'}
              />
            </Grid>
            <Grid item xs={10} md={6}>
              <div className={classes.publicToggle}>
                <FormControlLabel
                  control={<Switch name="public" inputRef={register} />}
                  label="Public"
                />
              </div>
            </Grid>
          </Grid>
        </Paper>
        <div className={classes.actions}>
          <Typography className={classes.header}>Environments</Typography>
          <ActionTemplateEnvs />
        </div>
        <div className={classes.actions}>
          <Typography className={classes.header}>Inputs</Typography>
          <ActionTemplateInputs />
        </div>
        <div className={classes.actions}>
          <Typography className={classes.header}>Backups</Typography>
          <ActionTemplateBackups />
        </div>
        {/* <div className={classes.actions}>
          <Typography className={classes.header}>Steps</Typography>
          <FieldArray
            name="steps"
            mainEditorPath={`${ACTION_TEMPLATES_PATH}/${templateId}`}
            component={ActionTemplateStep}
          />
        </div> */}
      </form>
    </FormContext>
  )
}

ActionTemplateForm.propTypes = {
  templateId: PropTypes.string.isRequired,
  startTemplateDelete: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
  editable: PropTypes.bool.isRequired
}

export default ActionTemplateForm
