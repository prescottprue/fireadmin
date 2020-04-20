import React from 'react'
import { useFirestore, useFirestoreDoc, useUser } from 'reactfire'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import defaultUserImageUrl from 'static/User.png'
import AccountForm from '../AccountForm'
import LoadingSpinner from 'components/LoadingSpinner'
import styles from './AccountEditor.styles'

const useStyles = makeStyles(styles)

function AccountEditor() {
  const classes = useStyles()
  const firestore = useFirestore()
  const user = useUser()
  const accountRef = firestore.doc(`users/${user.uid}`)
  const profileSnap = useFirestoreDoc(accountRef)
  const profile = profileSnap.data()

  async function updateAccount(changedAccount) {
    try {
      // Update auth profile (displayName, photoURL, etc)
      await user.updateProfile(changedAccount)
      // Update auth email if it is being changed
      if (user.email !== changedAccount.email) {
        await user.updateEmail(changedAccount.email)
      }
      // Update user document in Firestore
      await accountRef.set(changedAccount, { merge: true })
      return user
    } catch (error) {
      console.error('Error updating profile', error.message || error) // eslint-disable-line no-console
      throw error
    }
  }

  // Show loading spinner if email has not yet loaded (messagingToken loaded from cache sometimes)
  if (profile && !profile.email) {
    return <LoadingSpinner />
  }

  return (
    <Grid container spacing={2} justify="center">
      <Grid item xs={12} md={6} lg={6} className={classes.gridItem}>
        <img
          className={classes.avatarCurrent}
          src={(profile && profile.avatarUrl) || defaultUserImageUrl}
          alt=""
        />
      </Grid>
      <Grid item xs={12} md={6} lg={6} className={classes.gridItem}>
        <AccountForm onSubmit={updateAccount} account={profile} />
      </Grid>
    </Grid>
  )
}

export default AccountEditor
