import React from 'react'
import firebase from 'firebase/app' // imported for auth provider
import { useAuth, useFirestore } from 'reactfire'
import { makeStyles } from '@material-ui/core/styles'
import * as Sentry from '@sentry/browser'
import { USERS_COLLECTION } from 'constants/firebasePaths'
import useNotifications from 'modules/notification/useNotifications'
import { LIST_PATH } from 'constants/paths'
import styles from './LoginPage.styles'

const useStyles = makeStyles(styles)

function LoginPage() {
  const classes = useStyles()
  const auth = useAuth()
  const firestore = useFirestore()
  const { showError } = useNotifications()
  const [isLoading, changeLoadingState] = React.useState(false)

  async function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    changeLoadingState(true)
    const authMethod =
      window.isMobile && window.isMobile.any
        ? 'signInWithRedirect'
        : 'signInWithPopup'
    let authData
    try {
      authData = await auth[authMethod](provider)
    } catch (err) {
      console.error('Error with login:', err) // eslint-disable-line no-console
      showError(err.message)
      // Exit without reporting to error handler if error is from user leaving oAuth window open
      if (
        err.message.includes(
          'The popup has been closed by the user before finalizing the operation.'
        )
      ) {
        return
      }
      return Sentry.captureException(err)
    }

    try {
      // Load user account to see if it exists
      const userSnap = await firestore
        .doc(`${USERS_COLLECTION}/${authData.user.uid}`)
        .get()
      // Save new user account if it doesn't already exist
      if (!userSnap.exists) {
        const {
          email,
          displayName,
          providerData,
          lastLoginAt
        } = authData.user.toJSON()
        const userObject = { email, displayName, lastLoginAt }
        if (providerData) {
          userObject.providerData = providerData
        }
        await firestore
          .doc(`${USERS_COLLECTION}/${authData.user.uid}`)
          .set(userObject, { merge: true })
      }
      // NOTE: history.push sometimes does not trigger
      // history.push(LIST_PATH)
      window.location = LIST_PATH
    } catch (err) {
      console.error('Error setting user profile:', err) // eslint-disable-line no-console
      showError(err.message)
      Sentry.captureException(err)
    }
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
