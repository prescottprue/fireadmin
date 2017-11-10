import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import { reduxForm, Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import FlatButton from 'material-ui/FlatButton'
import FilesUploader from 'routes/Projects/routes/Project/components/FilesUploader'
import ServiceAccounts from 'routes/Projects/routes/Project/components/ServiceAccounts'
import { required } from 'utils/form'
import classes from './NewInstanceDialog.scss'

export const NewInstanceDialog = ({
  onFilesDrop,
  submit,
  reset,
  submitting,
  pristine,
  serviceAccounts,
  selectedAccounts,
  onRequestClose,
  onAccountClick,
  ...other
}) => (
  <Dialog
    title="Add Instance"
    actions={[
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={() => {
          reset()
          onRequestClose && onRequestClose()
        }}
      />,
      <FlatButton
        primary
        label="Create"
        style={{ marginLeft: '1.5rem' }}
        disabled={pristine || submitting}
        onTouchTap={submit}
        // labelStyle={{ color: colors.white }}
        // backgroundColor={colors.jellyBean}
        // hoverColor={colors.jellyBeanHover}
      />
    ]}
    {...other}>
    <div className={classes.body}>
      <Field
        component={TextField}
        name="name"
        floatingLabelText="Instance Name"
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

NewInstanceDialog.propTypes = {
  onFilesDrop: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  serviceAccounts: PropTypes.object,
  selectedAccounts: PropTypes.object,
  onRequestClose: PropTypes.func,
  onAccountClick: PropTypes.func,
  open: PropTypes.bool.isRequired // captured in other
}

export default reduxForm({
  form: 'newInstance'
})(NewInstanceDialog)
