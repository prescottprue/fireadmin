import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import Dialog, {
  DialogTitle,
  DialogActions,
  DialogContent
} from 'material-ui/Dialog'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import { formNames } from 'constants'
import { required, validateDatabaseUrl } from 'utils/form'
import FilesUploader from '../FilesUploader'
import ServiceAccounts from '../ServiceAccounts'
import classes from './AddEnvironmentDialog.scss'

export const AddEnvironmentDialog = ({
  onFilesDrop,
  submit,
  reset,
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
    <DialogTitle id="dialog-title">{`${
      isEditing ? 'Edit' : 'Add'
    } Environment`}</DialogTitle>
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
      {!isEditing ? (
        <div className={classes.serviceAccounts}>
          <Typography style={{ fontSize: '1.1rem' }}>
            Service Account
          </Typography>
          <FilesUploader
            onFilesDrop={onFilesDrop}
            label="to upload service account"
          />
          <ServiceAccounts
            projectId={projectId}
            serviceAccounts={serviceAccounts}
            selectedAccountKey={selectedServiceAccount}
            onAccountClick={onAccountClick}
          />
        </div>
      ) : null}
    </DialogContent>
    <DialogActions>
      <Button
        color="secondary"
        disabled={submitting}
        onClick={() => {
          reset()
          onRequestClose && onRequestClose()
        }}>
        Cancel
      </Button>
      <Button
        color="primary"
        disabled={pristine || submitting}
        onClick={submit}>
        {isEditing ? 'Save' : 'Create'}
      </Button>
    </DialogActions>
  </Dialog>
)

AddEnvironmentDialog.propTypes = {
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
  submitting: PropTypes.bool.isRequired, // from reduxForm
  pristine: PropTypes.bool.isRequired // from reduxForm
}

export default reduxForm({
  form: formNames.newEnvironment,
  enableReinitialize: true // Handle new/edit modal: reinitialize with other env to edit
})(AddEnvironmentDialog)
