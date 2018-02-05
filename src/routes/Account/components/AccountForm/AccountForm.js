import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import Button from 'material-ui/Button'
import { TextField } from 'redux-form-material-ui'
import ProviderDataForm from '../ProviderDataForm'
import classes from './AccountForm.scss'

export const AccountForm = ({ account, handleSubmit, submitting }) => (
  <form className={classes.container} onSubmit={handleSubmit}>
    <div className={classes.inputs}>
      <Field
        name="displayName"
        className={classes.field}
        component={TextField}
        label="Display Name"
      />
      <Field
        name="email"
        className={classes.field}
        component={TextField}
        label="Email"
      />
      <Field
        name="avatarUrl"
        className={classes.field}
        component={TextField}
        label="Avatar Url"
      />
    </div>
    {!!account &&
      !!account.providerData && (
        <div>
          <h4>Linked Accounts</h4>
          <ProviderDataForm providerData={account.providerData} />
        </div>
      )}
    <Button color="primary" type="submit" className={classes.submit}>
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
