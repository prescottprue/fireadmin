import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import GoogleButton from 'react-google-button'
import { LOGIN_PATH } from 'constants'

const SignupPage = ({ classes, emailSignup, googleLogin, onSubmitFail }) => (
  <div className={classes.root}>
    <div className={classes.providers}>
      <GoogleButton onClick={googleLogin} />
    </div>
    <div className={classes.login}>
      <span className={classes.loginLabel}>Already have an account?</span>
      <Link className={classes.loginLink} to={LOGIN_PATH}>
        Login
      </Link>
    </div>
  </div>
)

SignupPage.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  emailSignup: PropTypes.func.isRequired, // from enhancer (withHandlers)
  googleLogin: PropTypes.func.isRequired, // from enhancer (withHandlers)
  onSubmitFail: PropTypes.func.isRequired // from enhancer (reduxForm)
}

export default SignupPage
