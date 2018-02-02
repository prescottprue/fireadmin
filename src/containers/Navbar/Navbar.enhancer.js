import { connect } from 'react-redux'
import { withStyles } from 'material-ui-next/styles'
import {
  withHandlers,
  compose,
  withProps,
  flattenProp,
  withStateHandlers
} from 'recompose'
import Theme from 'theme'
import { withFirebase, isEmpty, isLoaded } from 'react-redux-firebase'
import { ACCOUNT_PATH } from 'constants'
import { withRouter, spinnerWhileLoading } from 'utils/components'

export default compose(
  withFirebase, // add props.firebase (firebaseConnect() can also be used)
  connect(({ firebase: { auth, profile } }) => ({
    auth,
    profile
  })),
  withRouter,
  // Wait for auth to be loaded before going further
  spinnerWhileLoading(['profile']),
  withStateHandlers(
    ({ accountMenuOpenInitially = false }) => ({
      accountMenuOpen: accountMenuOpenInitially,
      anchorEl: null
    }),
    {
      closeAccountMenu: ({ accountMenuOpen }) => () => ({
        anchorEl: null,
        accountMenuOpen: false
      }),
      handleMenu: () => event => ({
        anchorEl: event.target
      })
    }
  ),
  // Handlers
  withHandlers({
    handleLogout: props => () => {
      props.firebase.logout()
      props.router.push('/')
      props.closeAccountMenu()
    },
    goToAccount: props => () => {
      props.router.push(ACCOUNT_PATH)
      props.closeAccountMenu()
    }
  }),
  withProps(({ auth, profile }) => ({
    authExists: isLoaded(auth) && !isEmpty(auth)
  })),
  // Flatten profile so that avatarUrl and displayName are available
  flattenProp('profile'),
  withStyles({ color: Theme.palette.primary1Color })
)
