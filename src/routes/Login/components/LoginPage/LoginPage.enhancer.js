import { withHandlers, pure, compose } from 'recompose'
import { withFirebase } from 'react-redux-firebase'
import { withNotifications } from 'modules/notification'
import { UserIsNotAuthenticated } from 'utils/router'
import { triggerAnalyticsEvent } from 'utils/analytics'

export default compose(
  UserIsNotAuthenticated, // redirect to /projects if user is already authed
  withNotifications, // add props.showError
  withFirebase, // add props.firebase
  // Handlers as props
  withHandlers({
    onSubmitFail: props => (formErrs, dispatch, err) =>
      props.showError(formErrs ? 'Form Invalid' : err.message || 'Error'),
    googleLogin: ({ firebase, showError, router }) => event =>
      firebase
        .login({ provider: 'google', type: 'popup' })
        .then(() => {
          triggerAnalyticsEvent({ category: 'Auth', action: 'Login' })
        })
        .catch(err => showError(err.message))
  }),
  pure // shallow equals comparison on props (prevent unessesary re-renders)
)
