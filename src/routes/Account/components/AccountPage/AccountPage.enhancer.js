import { omit } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers, withProps } from 'recompose'
import withFirebase from 'react-redux-firebase/lib/withFirebase'
import { UserIsAuthenticated } from 'utils/router'
import { spinnerWhileLoading } from 'utils/components'

export default compose(
  UserIsAuthenticated, // redirect to /login if user is not authenticated
  withFirebase, // add props.firebase
  connect(({ firebase: { profile } }) => ({
    // get profile from redux state
    profile,
    avatarUrl: profile.avatarUrl
  })),
  spinnerWhileLoading(['profile']), // spinner until profile loads
  withHandlers({
    updateAccount: ({ firebase }) => newAccount =>
      firebase.updateProfile(newAccount)
  }),
  withProps(({ profile }) => ({
    cleanProfile: omit(profile, ['isEmpty', 'isLoaded'])
  }))
)
