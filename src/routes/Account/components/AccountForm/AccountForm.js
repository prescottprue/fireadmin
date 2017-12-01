import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import Button from 'material-ui-next/Button'
import { TextField } from 'redux-form-material-ui'
import ProviderDataForm from '../ProviderDataForm'
import classes from './AccountForm.scss'

export const AccountForm = ({ account, handleSubmit, submitting }) => (
  <form className={classes.container} onSubmit={handleSubmit}>
    <h4>Account</h4>
    <Field
      name="displayName"
      component={TextField}
      floatingLabelText="Display Name"
    />
    <Field name="email" component={TextField} floatingLabelText="Email" />
    <Field
      name="avatarUrl"
      component={TextField}
      floatingLabelText="Avatar Url"
    />
    {!!account &&
      !!account.providerData && (
        <div>
          <h4>Linked Accounts</h4>
          <ProviderDataForm providerData={account.providerData} />
        </div>
      )}
    <Button raised color="primary" type="submit" className={classes.submit}>
      Save
    </Button>
  </form>
)

AccountForm.propTypes = {
  account: PropTypes.object,
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool
}

export default AccountForm
