import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import { required, validateDatabaseUrl } from 'utils/form'
import classes from './EditEnvironmentDialog.scss'

export const EditEnvironmentDialog = ({
  submit,
  closeAndReset,
  submitting,
  projectId,
  pristine,
  onRequestClose,
  open
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
  onRequestClose: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  submit: PropTypes.func.isRequired, // from reduxForm
  closeAndReset: PropTypes.func.isRequired, // from reduxForm
  submitting: PropTypes.bool.isRequired, // from reduxForm
  pristine: PropTypes.bool.isRequired // from reduxForm
}

export default EditEnvironmentDialog
