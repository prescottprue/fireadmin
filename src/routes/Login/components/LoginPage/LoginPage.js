import React, { useState } from 'react'
import firebase from 'firebase/app' // imported for auth provider
import { useAuth } from 'reactfire'
import GoogleButton from 'react-google-button'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import useNotifications from 'modules/notification/useNotifications'
import { LIST_PATH } from 'constants/paths'
import LoadingSpinner from 'components/LoadingSpinner'
import styles from './LoginPage.styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles(styles)

function LoginPage() {
  const classes = useStyles()
  const auth = useAuth()
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
        // NOTE: history.push sometimes does not trigger
        // history.push(LIST_PATH)
        window.location = LIST_PATH
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
          <Typography className={classes.signupLabel}>
            Looking to Signup?
          </Typography>
          <Typography variant="subtitle1">
            Your account will be automatically created on first login
          </Typography>
        </div>
      </Paper>
    </Container>
  )
}

export default LoginPage
