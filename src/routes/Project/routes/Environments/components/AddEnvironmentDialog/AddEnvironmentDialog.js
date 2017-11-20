import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import { reduxForm, Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import Button from 'material-ui-next/Button'
import FilesUploader from '../FilesUploader'
import ServiceAccounts from '../ServiceAccounts'
import { required } from 'utils/form'
import classes from './AddEnvironmentDialog.scss'

export const AddEnvironmentDialog = ({
  onFilesDrop,
  submit,
  reset,
  submitting,
  pristine,
  isEditing,
  serviceAccounts,
  selectedAccounts,
  onRequestClose,
  initialValues,
  onAccountClick,
  ...other
}) => (
  <Dialog
    title="Add Environment"
    actions={[
      <Button
        color="accent"
        onTouchTap={() => {
          reset()
          onRequestClose && onRequestClose()
        }}>
        Cancel
      </Button>,
      <Button
        color="primary"
        style={{ marginLeft: '1.5rem' }}
        disabled={pristine || submitting}
        onTouchTap={submit}>
        {isEditing ? 'Save' : 'Create'}
      </Button>
    ]}
    {...other}>
    <div className={classes.body}>
      <Field
        component={TextField}
        name="name"
        floatingLabelText="Environment Name"
        validate={required}
      />
      <Field
        component={TextField}
        name="databaseURL"
        floatingLabelText="Database URL"
      />
      <Field
        component={TextField}
        name="description"
        floatingLabelText="Instance Description"
      />
      <div>
        <h4>Service Account</h4>
        {serviceAccounts ? (
          <ServiceAccounts
            serviceAccounts={serviceAccounts}
            selectedAccounts={selectedAccounts}
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
    </div>
  </Dialog>
)

AddEnvironmentDialog.propTypes = {
  serviceAccounts: PropTypes.object,
  selectedAccounts: PropTypes.object,
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
  form: 'newInstance',
  enableReinitialize: true // Handle new/edit modal: reinitialize with other env to edit
})(AddEnvironmentDialog)
