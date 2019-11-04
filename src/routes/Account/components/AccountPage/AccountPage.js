import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import defaultUserImageUrl from 'static/User.png'
import AccountForm from '../AccountForm'
import styles from './AccountPage.styles'

const useStyles = makeStyles(styles)

function AccountPage({ updateAccount, cleanProfile }) {
  const classes = useStyles()

  return (
    <Grid container className={classes.root} justify="center">
      <Grid item xs={10} md={8} lg={6} className={classes.gridItem}>
        <Paper className={classes.pane}>
          <Typography variant="h4" className={classes.title}>
            Account
          </Typography>
          <Grid container spacing={2} justify="center">
            <Grid item xs={12} md={6} lg={6} className={classes.gridItem}>
              <img
                className={classes.avatarCurrent}
                src={cleanProfile.avatarUrl || defaultUserImageUrl}
                alt=""
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6} className={classes.gridItem}>
              <AccountForm
                onSubmit={updateAccount}
                account={cleanProfile}
                initialValues={cleanProfile}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

AccountPage.propTypes = {
  updateAccount: PropTypes.func.isRequired, // from enhancer (withHandlers)
  cleanProfile: PropTypes.object, // from enhancer (withProps)
  profile: PropTypes.object
}

export default AccountPage
