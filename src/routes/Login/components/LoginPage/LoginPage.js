import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import GoogleButton from 'react-google-button'
import { SIGNUP_PATH } from 'constants'

import classes from './LoginPage.scss'

export const LoginPage = ({ emailLogin, googleLogin, onSubmitFail }) => (
  <div className={classes.container}>
    <div className={classes.providers}>
      <GoogleButton onClick={googleLogin} />
    </div>
    <div className={classes.signup}>
      <span className={classes.signupLabel}>Need an account?</span>
      <Link className={classes.signupLink} to={SIGNUP_PATH}>
        Sign Up
      </Link>
    </div>
  </div>
)

LoginPage.propTypes = {
  emailLogin: PropTypes.func,
  onSubmitFail: PropTypes.func,
  googleLogin: PropTypes.func
}

export default LoginPage
