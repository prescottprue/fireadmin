import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import defaultUserImageUrl from 'static/User.png'
import AccountForm from '../AccountForm'

function AccountPage({ classes, avatarUrl, updateAccount, cleanProfile }) {
  return (
    <div className={classes.root}>
      <Paper className={classes.pane}>
        <Typography variant="h6" className={classes.title}>
          Account
        </Typography>
        <div className={classes.settings}>
          <div className={classes.avatar}>
            <img
              className={classes.avatarCurrent}
              src={avatarUrl || defaultUserImageUrl}
              alt=""
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
}

AccountPage.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  updateAccount: PropTypes.func.isRequired, // from enhancer (withHandlers)
  cleanProfile: PropTypes.object, // from enhancer (withProps)
  avatarUrl: PropTypes.string,
  profile: PropTypes.object
}

export default AccountPage
