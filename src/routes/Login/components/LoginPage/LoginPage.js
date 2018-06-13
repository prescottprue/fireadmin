import React from 'react'
import PropTypes from 'prop-types'
// import { Link } from 'react-router'
import GoogleButton from 'react-google-button'
import Paper from '@material-ui/core/Paper'

import classes from './LoginPage.scss'

export const LoginPage = ({ emailLogin, googleLogin, onSubmitFail }) => (
  <div className={classes.container}>
    <Paper className={classes.panel}>
      <div className={classes.instructions}>
        Click below to login using your Google Account
      </div>
      <div className={classes.providers}>
        <GoogleButton onClick={googleLogin} />
      </div>
    </Paper>
  </div>
)

LoginPage.propTypes = {
  emailLogin: PropTypes.func,
  onSubmitFail: PropTypes.func,
  googleLogin: PropTypes.func
}

export default LoginPage
