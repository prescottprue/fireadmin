import React, { useState } from 'react'
import { Link, useHistory, Redirect } from 'react-router-dom'
import firebase from 'firebase/app' // imported for auth provider
import { useAuth } from 'reactfire'
import GoogleButton from 'react-google-button'
import { makeStyles } from '@material-ui/core/styles'
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

  auth.onAuthStateChanged((auth) => {
    if (auth) {
      changeLoadingState(false)
      history.replace(LIST_PATH)
    }
  })

  function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    const authMethod =
      window.isMobile && window.isMobile.any
        ? 'signInWithRedirect'
        : 'signInWithPopup'
    changeLoadingState(true)
    return auth[authMethod](provider).catch((err) => showError(err.message))
  }

  // Redirect to list view if logged in
  if (auth.currentUser) {
    return <Redirect to={{ pathname: LIST_PATH }} />
  }

  return (
    <div className={classes.root}>
      <div className={classes.providers}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <GoogleButton onClick={googleLogin} data-test="google-auth-button" />
        )}
      </div>
      <div className={classes.signup}>
        <span className={classes.signupLabel}>Need an account?</span>
        <Link className={classes.signupLink} to={SIGNUP_PATH}>
          Sign Up
        </Link>
      </div>
    </div>
  )
}

export default LoginPage
