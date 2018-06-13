import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import AccountForm from '../AccountForm'
import defaultUserImageUrl from 'static/User.png'
import classes from './AccountPage.scss'

export const AccountPage = ({ avatarUrl, updateAccount, cleanProfile }) => (
  <div className={classes.container}>
    <Paper className={classes.pane}>
      <Typography variant="title" className={classes.title}>
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
  </div>
)

AccountPage.propTypes = {
  avatarUrl: PropTypes.string,
  cleanProfile: PropTypes.object,
  updateAccount: PropTypes.func
}

export default AccountPage
