import React from 'react'
import PropTypes from 'prop-types'
import { useFirestore, useFirestoreDocData, useUser } from 'reactfire'
import { useForm } from 'react-hook-form'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles } from '@material-ui/core/styles'
import styles from './EditEnvironmentDialog.styles'
import { createPermissionGetter } from 'utils/data'
import { PROJECTS_COLLECTION } from 'constants/firebasePaths'
import { databaseURLToProjectName } from 'utils/index'

const useStyles = makeStyles(styles)

function EditEnvironmentDialog({
  onSubmit,
  projectId,
  onRequestClose,
  open,
  selectedInstance,
  projectEnvironments
}) {
  const classes = useStyles()
  // Data
  const firestore = useFirestore()
  const user = useUser()
  const projectRef = firestore.doc(`${PROJECTS_COLLECTION}/${projectId}`)
  const project = useFirestoreDocData(projectRef)
  const userHasPermission = createPermissionGetter(project, user?.uid)
  // TODO: Remove checking of ownership once update role is setup by default on project
  const hasUpdatePermission =
    user?.uid === project.createdBy || userHasPermission('update.environments')

  // Form
  const defaultValues = {
    ...selectedInstance,
    databaseName: databaseURLToProjectName(selectedInstance.databaseURL)
  }
  const {
    register,
    handleSubmit,
    reset,
    watch,
    errors,
    formState: { isValid, isSubmitting, touched }
  } = useForm({ defaultValues, mode: 'onChange' })

  // Disabled states
  const lockedDisabled =
    !hasUpdatePermission ||
    // Form is clean and the environment is currently read only or write only
    (touched && (selectedInstance.readOnly || selectedInstance.writeOnly)) ||
    watch('readOnly') ||
    watch('writeOnly')
  const readOnlyDisabled =
    !hasUpdatePermission ||
    // Form is clean and the environment is currently locked or write only
    (touched && (selectedInstance.locked || selectedInstance.writeOnly)) ||
    watch('locked') ||
    watch('writeOnly')
  const writeOnlyDisabled =
    !hasUpdatePermission ||
    // Form is clean and the environment is currently locked or read only
    (touched && (selectedInstance.locked || selectedInstance.readOnly)) ||
    watch('locked') ||
    watch('readOnly')

  // Handlers
  function closeAndReset() {
    reset()
    onRequestClose()
  }

  return (
    <Dialog onClose={onRequestClose} open={open}>
      <DialogTitle id="dialog-title">Edit Environment</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className={classes.body}>
          <div className={classes.inputs}>
            <TextField
              name="name"
              label="Environment Name"
              margin="normal"
              inputRef={register({
                required: true
              })}
              fullWidth
            />
            <TextField
              name="databaseName"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">https://</InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    .firebaseio.com
                  </InputAdornment>
                )
              }}
              inputRef={register({
                required: true
              })}
              error={!!errors.databaseURL}
              helperText={errors.databaseURL && 'Database URL must be valid'}
              margin="normal"
              fullWidth
              label="Database URL"
              data-test="new-environment-db-url"
            />
            <TextField
              name="description"
              label="Instance Description"
              margin="normal"
              inputRef={register}
              fullWidth
            />
            <Grid container className={classes.settings} spacing={8}>
              <Grid item xs={12}>
                <FormLabel>Action Settings</FormLabel>
                <Grid container>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="locked"
                          disabled={lockedDisabled}
                          inputRef={register}
                          defaultChecked={selectedInstance.locked}
                        />
                      }
                      label="Locked (prevents all actions)"
                    />
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="readOnly"
                          disabled={readOnlyDisabled}
                          inputRef={register}
                          defaultChecked={selectedInstance.readOnly}
                        />
                      }
                      label="Read Only"
                    />
                  </Grid>
                  <Grid>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="writeOnly"
                          disabled={writeOnlyDisabled}
                          inputRef={register}
                          defaultChecked={selectedInstance.writeOnly}
                        />
                      }
                      label="Write Only"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            disabled={isSubmitting}
            onClick={closeAndReset}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={!isValid || isSubmitting}>
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

EditEnvironmentDialog.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  selectedInstance: PropTypes.object.isRequired,
  projectEnvironments: PropTypes.array.isRequired,
  projectId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired
}

export default EditEnvironmentDialog
