import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import { TextField, Checkbox } from 'redux-form-material-ui'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { required, validateDatabaseUrl } from 'utils/form'

const EditEnvironmentDialog = ({
  classes,
  submit,
  closeAndReset,
  submitting,
  projectId,
  pristine,
  onRequestClose,
  open,
  envUpdateDisabled
}) => (
  <Dialog onClose={onRequestClose} open={open}>
    <DialogTitle id="dialog-title">Edit Environment</DialogTitle>
    <DialogContent className={classes.body}>
      <div className={classes.inputs}>
        <Field
          component={TextField}
          className={classes.field}
          name="name"
          validate={required}
          fullWidth
          label="Environment Name"
        />
        <Field
          component={TextField}
          className={classes.field}
          name="databaseURL"
          fullWidth
          validate={[required, validateDatabaseUrl]}
          label="Database URL"
        />
        <Field
          component={TextField}
          className={classes.field}
          fullWidth
          name="description"
          label="Instance Description"
        />
        <Grid container className={classes.settings} spacing={16}>
          <Grid item xs={12}>
            <FormLabel>Action Settings</FormLabel>
            <Grid container>
              <Grid item>
                <FormControlLabel
                  control={
                    <Field
                      name="locked"
                      component={Checkbox}
                      disabled={envUpdateDisabled}
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
                    <Field
                      name="onlySrc"
                      component={Checkbox}
                      disabled={envUpdateDisabled}
                    />
                  }
                  label="Only A Source (prevents writes)"
                />
              </Grid>
              <Grid>
                <FormControlLabel
                  control={
                    <Field
                      name="onlyDest"
                      component={Checkbox}
                      disabled={envUpdateDisabled}
                    />
                  }
                  label="Only A Destination (prevents reads)"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </DialogContent>
    <DialogActions>
      <Button color="secondary" disabled={submitting} onClick={closeAndReset}>
        Cancel
      </Button>
      <Button
        color="primary"
        disabled={pristine || submitting}
        onClick={submit}>
        Save
      </Button>
    </DialogActions>
  </Dialog>
)

EditEnvironmentDialog.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  envUpdateDisabled: PropTypes.bool.isRequired, // from enhancer (connect)
  submit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  closeAndReset: PropTypes.func.isRequired, // from enhancer (reduxForm)
  submitting: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  onRequestClose: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired
}

export default EditEnvironmentDialog
