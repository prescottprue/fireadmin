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
import { setStringToClipboard } from 'utils/browser'
import styles from './ApiKeysSection.styles'

export default compose(
  // Map auth uid from state to props
  connect(({ firebase: { auth: { uid } } }) => ({ uid })),
  // create listener for tokens, results go into redux
  firestoreConnect(({ uid }) => {
    return [
      {
        collection: USERS_COLLECTION,
        doc: uid,
        subcollections: [{ collection: USER_API_KEYS_SUBCOLLECTION }],
        storeAs: `${uid}-apikeys`
      }
    ]
  }),
  // map redux state to props
  connect(({ firestore: { data } }, { uid }) => ({
    tokens: data[`${uid}-apikeys`]
  })),
  withHandlers({
    copyApiKey: () => apiKey => {
      setStringToClipboard(apiKey)
    },
    generateApiKey: ({ uid }) => () => {
      return new User(uid).generateApiKey()
    }
  }),
  withStyles(styles)
)
