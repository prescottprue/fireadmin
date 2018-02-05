import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import Dialog from 'material-ui/Dialog'
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
  pristine,
  isEditing,
  serviceAccounts,
  selectedServiceAccount,
  onRequestClose,
  initialValues,
  onAccountClick,
  open
}) => (
  <Dialog
    title={`${isEditing ? 'Edit' : 'Add'} Environment`}
    onClose={onRequestClose}
    open={open}>
    <div className={classes.body}>
      <Field
        component={TextField}
        name="name"
        validate={required}
        fullWidth
        label="Environment Name"
      />
      <Field
        component={TextField}
        name="databaseURL"
        fullWidth
        validate={[required, validateDatabaseUrl]}
        label="Database URL"
      />
      <Field
        component={TextField}
        fullWidth
        name="description"
        label="Instance Description"
      />
      {!isEditing ? (
        <div>
          <h4>Service Account</h4>
          {serviceAccounts ? (
            <ServiceAccounts
              serviceAccounts={serviceAccounts}
              selectedAccountKey={selectedServiceAccount}
              onAccountClick={onAccountClick}
            />
          ) : (
            <div>No Service Accounts </div>
          )}
          <FilesUploader
            onFilesDrop={onFilesDrop}
            label="to upload Service Account"
          />
        </div>
      ) : null}
    </div>
    <div className={classes.buttons}>
      <Button
        color="secondary"
        disabled={submitting}
        onTouchTap={() => {
          reset()
          onRequestClose && onRequestClose()
        }}>
        Cancel
      </Button>
      <Button
        color="primary"
        style={{ marginLeft: '1rem' }}
        disabled={pristine || submitting}
        onTouchTap={submit}>
        {isEditing ? 'Save' : 'Create'}
      </Button>
    </div>
  </Dialog>
)

AddEnvironmentDialog.propTypes = {
  serviceAccounts: PropTypes.object,
  selectedServiceAccount: PropTypes.string,
  onRequestClose: PropTypes.func,
  onAccountClick: PropTypes.func,
  onFilesDrop: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
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
