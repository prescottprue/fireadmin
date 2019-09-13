import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  USERS_COLLECTION,
  USER_API_KEYS_SUBCOLLECTION
} from '@fireadmin/core/lib/constants/firestorePaths'
import User from '@fireadmin/core/lib/User'
import firestoreConnect from 'react-redux-firebase/lib/firestoreConnect'
import { withStyles } from '@material-ui/core/styles'
import { withHandlers } from 'recompose'
import styles from './ApiKeysSection.styles'
import { withNotifications } from 'modules/notification'
import { spinnerWhileLoading } from 'utils/components'

export default compose(
  withNotifications,
  // Map auth uid from state to props
  connect(({ firebase: { auth: { uid } } }) => ({ uid })),
  // create listener for tokens, results go into redux
  firestoreConnect(({ uid }) => {
    return [
      {
        collection: USERS_COLLECTION,
        doc: uid,
        subcollections: [{ collection: USER_API_KEYS_SUBCOLLECTION }],
        orderBy: ['createdAt'],
        storeAs: `${uid}-apikeys`
      }
    ]
  }),
  // map redux state to props
  connect(({ firestore: { ordered } }, { uid }) => ({
    tokens: ordered[`${uid}-apikeys`]
  })),
  spinnerWhileLoading(['tokens']),
  withHandlers({
    generateApiKey: ({ uid, showSuccess, showError }) => () => {
      return new User(uid)
        .generateApiKey()
        .then(apiKey => {
          showSuccess('Successfully generated API Key')
        })
        .catch(err => {
          showError('Error generating API Key')
          return Promise.reject(err)
        })
    }
  }),
  withStyles(styles)
)
