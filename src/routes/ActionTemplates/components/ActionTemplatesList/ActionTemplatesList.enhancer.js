import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStateHandlers, withHandlers } from 'recompose'
import { ACTION_TEMPLATES_PATH } from 'constants/firebasePaths'
import firestoreConnect from 'react-redux-firebase/lib/firestoreConnect'
import { withRouter } from 'react-router-dom'
import { spinnerWhileLoading } from 'utils/components'
import { withNotifications } from 'modules/notification'
import * as handlers from './ActionTemplatesList.handlers'

export default compose(
  withNotifications,
  withRouter,
  // Map auth uid from state to props
  connect(({ firebase: { auth: { uid } } }) => ({ uid })),
  // Show spinner while uid is loading
  spinnerWhileLoading(['uid']),
  // Set listeners for Firestore
  firestoreConnect(({ uid }) => [
    {
      collection: ACTION_TEMPLATES_PATH,
      where: ['public', '==', true],
      limit: 30
    },
    // Listener for projects current user collaborates on
    {
      collection: ACTION_TEMPLATES_PATH,
      where: [
        ['createdBy', '==', uid],
        ['public', '==', false]
      ],
      storeAs: 'myTemplates'
    }
  ]),
  // map redux state to props
  connect(({ firestore: { ordered: { actionTemplates, myTemplates } } }) => ({
    actionTemplates,
    myTemplates
  })),
  // Show spinner while actionTemplates is loading
  spinnerWhileLoading(['actionTemplates']),
  withStateHandlers(
    () => ({
      newDialogOpen: false
    }),
    {
      toggleNewDialog: ({ newDialogOpen }) => () => ({
        newDialogOpen: !newDialogOpen
      })
    }
  ),
  withHandlers(handlers)
)
