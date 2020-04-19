import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import firebase from 'firebase/app' // imported for auth provider
import { useAuth } from 'reactfire'
import GoogleButton from 'react-google-button'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import useNotifications from 'modules/notification/useNotifications'
import { SIGNUP_PATH, LIST_PATH } from 'constants/paths'
import LoadingSpinner from 'components/LoadingSpinner'
import styles from './LoginPage.styles'

const useStyles = makeStyles(styles)

function LoginPage() {
  const classes = useStyles()
  const auth = useAuth()
  const history = useHistory()
  const { showError } = useNotifications()
  const [isLoading, changeLoadingState] = useState(false)

  function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    changeLoadingState(true)
    const authMethod =
      window.isMobile && window.isMobile.any
        ? 'signInWithRedirect'
        : 'signInWithPopup'

    return auth[authMethod](provider)
      .then(() => {
        history.push(LIST_PATH)
      })
      .catch((err) => showError(err.message))
  }

  return (
    <Container className={classes.root}>
      <Paper className={classes.panel}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <GoogleButton onClick={googleLogin} data-test="google-auth-button" />
        )}
        <div className={classes.signup}>
          <span className={classes.signupLabel}>Need an account?</span>
          <Link className={classes.signupLink} to={SIGNUP_PATH}>
            Sign Up
          </Link>
        </div>
      </Paper>
    </Container>
  )
}

export default LoginPage
