import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import {
  withHandlers,
  compose,
  withProps,
  flattenProp,
  withStateHandlers,
  setDisplayName
} from 'recompose'
import Theme from 'theme'
import { withFirebase, isEmpty, isLoaded } from 'react-redux-firebase'
import { ACCOUNT_PATH } from 'constants'
import { withRouter, spinnerWhileLoading } from 'utils/components'

export default compose(
  setDisplayName('Navbar'),
  // add props.firebase
  withFirebase,
  // add props.router (router.push used in enhancers)
  withRouter,
  // get auth and profile from state
  connect(({ firebase: { auth, profile } }) => ({
    auth,
    profile
  })),
  // Wait for auth to be loaded before going further
  spinnerWhileLoading(['profile']),
  // State handlers for account menu
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
  // Flatten profile prop (adds avatarUrl and displayName to props)
  flattenProp('profile'),
  withStyles({ color: Theme.palette.primary1Color })
)
