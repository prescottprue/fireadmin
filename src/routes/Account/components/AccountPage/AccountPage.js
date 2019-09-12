import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import AccountForm from '../AccountForm'
import ApiKeysSection from '../ApiKeysSection'

function AccountPage({ classes, avatarUrl, cleanProfile, firebase }) {
  return (
    <Grid container className={classes.root} spacing={16} justify="center">
      <Grid item xs={12} sm={8}>
        <Paper className={classes.pane}>
          <Typography variant="h6" className={classes.title}>
            Account
          </Typography>
          <AccountForm
            onSubmit={firebase.updateProfile}
            account={cleanProfile}
            initialValues={cleanProfile}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={8}>
        <ApiKeysSection />
      </Grid>
    </Grid>
  )
}

AccountPage.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  firebase: PropTypes.shape({
    updateProfile: PropTypes.func.isRequired // from enhancer (withFirebase)
  }).isRequired,
  avatarUrl: PropTypes.string, // from enhancer (connect)
  cleanProfile: PropTypes.object // from enhancer (withProps + connect)
}

export default AccountPage
