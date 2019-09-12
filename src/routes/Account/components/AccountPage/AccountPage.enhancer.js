import { omit } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import withFirebase from 'react-redux-firebase/lib/withFirebase'
import { UserIsAuthenticated } from 'utils/router'
import { spinnerWhileLoading } from 'utils/components'
import { withStyles } from '@material-ui/core/styles'
import styles from './AccountPage.styles'

export default compose(
  UserIsAuthenticated, // redirect to /login if user is not authenticated
  withFirebase, // add props.firebase
  connect(({ firebase: { profile } }) => ({
    // get profile from redux state
    profile,
    cleanProfile: omit(profile, ['isEmpty', 'isLoaded'])
  })),
  spinnerWhileLoading(['profile']), // spinner until profile loads
  withStyles(styles)
)
