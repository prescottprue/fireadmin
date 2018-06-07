import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import Dialog, {
  DialogTitle,
  DialogActions,
  DialogContent
} from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import { required, validateDatabaseUrl } from 'utils/form'
import classes from './EditEnvironmentDialog.scss'

export const EditEnvironmentDialog = ({
  onFilesDrop,
  submit,
  reset,
  closeAndReset,
  submitting,
  projectId,
  pristine,
  isEditing,
  serviceAccounts,
  selectedServiceAccount,
  onRequestClose,
  initialValues,
  onAccountClick,
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
  serviceAccounts: PropTypes.object,
  selectedServiceAccount: PropTypes.string,
  onRequestClose: PropTypes.func,
  onAccountClick: PropTypes.func,
  onFilesDrop: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  projectId: PropTypes.string,
  open: PropTypes.bool.isRequired, // captured in other
  initialValues: PropTypes.object, // from reduxForm
  submit: PropTypes.func.isRequired, // from reduxForm
  reset: PropTypes.func.isRequired, // from reduxForm
  closeAndReset: PropTypes.func.isRequired, // from reduxForm
  submitting: PropTypes.bool.isRequired, // from reduxForm
  pristine: PropTypes.bool.isRequired // from reduxForm
}

export default EditEnvironmentDialog
