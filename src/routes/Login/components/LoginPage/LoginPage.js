import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import GoogleButton from 'react-google-button'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { SIGNUP_PATH } from 'constants/paths'
import LoadingSpinner from 'components/LoadingSpinner'
import { triggerAnalyticsEvent } from 'utils/analytics'
import { LIST_PATH } from 'constants/paths'

import styles from './LoginPage.styles'

const useStyles = makeStyles(styles)

function LoginPage({ firebase, showError, history }) {
  const classes = useStyles()
  const [isLoading, changeLoadingState] = useState(false)

  function googleLogin() {
    triggerAnalyticsEvent('login', { category: 'Auth', action: 'Login' })
    changeLoadingState(true)
    return firebase
      .login({
        provider: 'google',
        type: window.isMobile && window.isMobile.any ? 'redirect' : 'popup'
      })
      .then(() => {
        history.push(LIST_PATH)
      })
      .catch((err) => showError(err.message))
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.panel}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <GoogleButton onClick={googleLogin} data-test="google-auth-button" />
        )}
        <div className={classes.signup}>
          <span className={classes.signupLabel}>Need an account?</span>
          <Button component={Link} to={SIGNUP_PATH}>
            Sign Up
          </Button>
        </div>
      </Paper>
    </div>
  )
}

LoginPage.propTypes = {
  firebase: PropTypes.shape({
    login: PropTypes.func.isRequired // used in handlers
  }),
  showError: PropTypes.func.isRequired // from enhancer (withNotifications)
}

export default LoginPage
