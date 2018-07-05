import { withFirebase } from 'react-redux-firebase'
import { withHandlers, pure, compose } from 'recompose'
import { UserIsNotAuthenticated } from 'utils/router'
import { withNotifications } from 'modules/notification'
import { triggerAnalyticsEvent } from 'utils/analytics'

export default compose(
  UserIsNotAuthenticated, // redirect to list page if logged in
  withNotifications, // add props.showError
  withFirebase, // add props.firebase (firebaseConnect() can also be used)
  // Handlers
  withHandlers({
    onSubmitFail: props => (formErrs, dispatch, err) =>
      props.showError(formErrs ? 'Form Invalid' : err.message || 'Error'),
    googleLogin: ({ firebase, showError }) => e =>
      firebase
        .login({ provider: 'google', type: 'popup' })
        .then(() => {
          triggerAnalyticsEvent('signup')
        })
        .catch(err => showError(err.message || 'Error with Signup'))
  }),
  pure // shallow equals comparison on props (prevent unessesary re-renders)
)
