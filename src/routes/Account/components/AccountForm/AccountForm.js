import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { TextField } from 'redux-form-material-ui'
import ProviderDataForm from '../ProviderDataForm'
import defaultUserImageUrl from 'static/User.png'

function AccountForm({ classes, account, handleSubmit, submitting, pristine }) {
  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <Grid container spacing={16} justify="center">
        <Grid item xs={12} sm={8} md={4} className={classes.avatar}>
          <img
            className={classes.avatarCurrent}
            src={account.avatarUrl || defaultUserImageUrl}
          />
        </Grid>
        <Grid item xs={12} sm={8} md={4} className={classes.meta}>
          <Grid container spacing={16} justify="center">
            <Grid item xs={10} sm={8} md={12}>
              <Field
                fullWidth
                name="displayName"
                component={TextField}
                label="Display Name"
              />
            </Grid>
            <Grid item xs={10} sm={8} md={12}>
              <Field
                fullWidth
                name="email"
                label="Email"
                component={TextField}
              />
            </Grid>
            <Grid item xs={10} sm={8} md={12}>
              <Field
                fullWidth
                name="avatarUrl"
                label="Avatar Url"
                component={TextField}
              />
            </Grid>
          </Grid>
          {!!account && !!account.providerData && (
            <div>
              <h4>Linked Accounts</h4>
              <ProviderDataForm providerData={account.providerData} />
            </div>
          )}
        </Grid>
      </Grid>
      <Grid container className={classes.buttons} spacing={16} justify="center">
        <Grid item xs={2}>
          <Button
            color="primary"
            type="submit"
            variant="contained"
            disabled={pristine || submitting}>
            {submitting ? 'Saving' : 'Save'}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

AccountForm.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  submitting: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  account: PropTypes.object
}

export default AccountForm
