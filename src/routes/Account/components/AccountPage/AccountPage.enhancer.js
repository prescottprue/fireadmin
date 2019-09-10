import PropTypes from 'prop-types'
import { omit } from 'lodash'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import withFirebase from 'react-redux-firebase/lib/withFirebase'
import { withHandlers, setPropTypes, withProps } from 'recompose'
import { spinnerWhileLoading } from 'utils/components'
import { withNotifications } from 'modules/notification'
import { UserIsAuthenticated } from 'utils/router'
import styles from './AccountPage.styles'

export default compose(
  UserIsAuthenticated, // redirect to /login if user is not authenticated
  withFirebase, // add props.firebase
  withNotifications,
  connect(({ firebase: { profile } }) => ({
    // get profile from redux state
    profile,
    avatarUrl: profile.avatarUrl
  })),
  spinnerWhileLoading(['profile']), // spinner until profile loads
  setPropTypes({
    showSuccess: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
    firebase: PropTypes.shape({
      updateProfile: PropTypes.func.isRequired
    })
  }),
  withHandlers({
    updateAccount: ({ firebase, showSuccess, showError }) => newAccount =>
      firebase
        .updateProfile(newAccount)
        .then(() => showSuccess('Profile updated successfully'))
        .catch(error => {
          showError('Error updating profile: ', error.message || error)
          console.error('Error updating profile', error.message || error) // eslint-disable-line no-console
          return Promise.reject(error)
        })
  }),
  withProps(({ profile }) => ({
    cleanProfile: omit(profile, ['isEmpty', 'isLoaded'])
  })),
  // add props.classes
  withStyles(styles)
)
