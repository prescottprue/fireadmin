import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import AccountForm from '../AccountForm'
import defaultUserImageUrl from 'static/User.png'
import ApiKeysSection from '../ApiKeysSection'
import classes from './AccountPage.scss'

function AccountPage({ avatarUrl, updateAccount, cleanProfile }) {
  return (
    <Grid container className={classes.container} spacing={16} justify="center">
      <Grid item xs={12} sm={8}>
        <Paper className={classes.pane}>
          <Typography variant="h6" className={classes.title}>
            Account
          </Typography>
          <div className={classes.settings}>
            <div className={classes.avatar}>
              <img
                className={classes.avatarCurrent}
                src={avatarUrl || defaultUserImageUrl}
              />
            </div>
            <div className={classes.meta}>
              <AccountForm
                onSubmit={updateAccount}
                account={cleanProfile}
                initialValues={cleanProfile}
              />
            </div>
          </div>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={8}>
        <ApiKeysSection />
      </Grid>
    </Grid>
  )
}

AccountPage.propTypes = {
  avatarUrl: PropTypes.string,
  cleanProfile: PropTypes.object,
  updateAccount: PropTypes.func
}

export default AccountPage
