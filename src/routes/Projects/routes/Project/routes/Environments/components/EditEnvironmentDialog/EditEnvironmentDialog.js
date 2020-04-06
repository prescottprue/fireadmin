import React from 'react'
import PropTypes from 'prop-types'
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
import { makeStyles } from '@material-ui/core/styles'
import { validateDatabaseUrl } from 'utils/form'
import styles from './EditEnvironmentDialog.styles'

const useStyles = makeStyles(styles)

function EditEnvironmentDialog({ onSubmit, projectId, onRequestClose, open }) {
  const classes = useStyles()
  const {
    register,
    handleSubmit,
    reset,
    formState: { dirty, isSubmitting }
  } = useForm()

  // TODO: Build from data
  const lockedDisabled = false
  const readOnlyDisabled = false
  const writeOnlyDisabled = false
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
              inputRef={register}
              fullWidth
            />
            <TextField
              name="databaseURL"
              label="Database URL"
              margin="normal"
              inputRef={register({
                required: true,
                validate: validateDatabaseUrl
              })}
              fullWidth
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
            disabled={!dirty || isSubmitting}>
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
  projectId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired
}

export default EditEnvironmentDialog
