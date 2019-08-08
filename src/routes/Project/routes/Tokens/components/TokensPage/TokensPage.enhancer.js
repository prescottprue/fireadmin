import { compose } from 'redux'
import { connect } from 'react-redux'
import firebase from 'firebase/app'
import { PROJECTS_COLLECTION } from '@fireadmin/core/lib/constants/firestorePaths'
import firestoreConnect from 'react-redux-firebase/lib/firestoreConnect'
import { withStyles } from '@material-ui/core/styles'
import { withHandlers, withStateHandlers } from 'recompose'
import { setStringToClipboard } from 'utils/browser'
import styles from './TokensPage.styles'

export default compose(
  // Map auth uid from state to props
  connect(({ firebase: { auth: { uid } } }) => ({ uid })),
  // create listener for tokens, results go into redux
  firestoreConnect(({ params: { projectId }, uid }) => {
    return [
      {
        collection: PROJECTS_COLLECTION,
        doc: projectId,
        subcollections: [{ collection: 'tokens' }],
        where: ['createdBy', '==', uid],
        storeAs: `${projectId}-tokens`
      }
    ]
  }),
  // map redux state to props
  connect(({ firestore: { data } }, { params: { projectId } }) => ({
    tokens: data[`${projectId}-tokens`]
  })),
  withStateHandlers(
    {
      token: null
    },
    {
      setToken: () => token => ({
        token
      })
    }
  ),
  withHandlers({
    copyToken: ({ token }) => () => {
      setStringToClipboard(token)
    },
    generateToken: ({ setToken, params: { projectId } }) => () => {
      return firebase
        .functions()
        .httpsCallable('generateApiToken')({ projectId })
        .then(res => {
          setToken(res.data)
        })
        .catch(err => {
          console.error('Error generating token:', err.message || err) // eslint-disable-line no-console
          return Promise.reject(err)
        })
    }
  }),
  withStyles(styles)
)
