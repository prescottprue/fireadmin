import { compose } from 'redux'
import { connect } from 'react-redux'
import firebase from 'firebase/app'
import { withHandlers } from 'recompose'
import firestoreConnect from 'react-redux-firebase/lib/firestoreConnect'
import { withStyles } from '@material-ui/core/styles'
import { PROJECTS_COLLECTION } from '@fireadmin/core/lib/constants/firestorePaths'
import styles from './TokensPage.styles'

export default compose(
  // create listener for tokens, results go into redux
  firestoreConnect(({ params: { projectId } }) => [
    {
      collection: PROJECTS_COLLECTION,
      doc: projectId,
      subcollections: [{ collection: 'tokens' }],
      storeAs: `${projectId}-tokens`
    }
  ]),
  // map redux state to props
  connect(({ firestore: { data } }, { params: { projectId } }) => ({
    tokens: data[`${projectId}-tokens`]
  })),
  withHandlers({
    generateToken: ({ params: { projectId } }) => () => {
      return firebase
        .functions()
        .httpsCallable('generateAuthToken')({ projectId })
        .then(token => {
          // console.log('token', token)
        })
        .catch(err => {
          console.error('Error generating token:', err.message || err) // eslint-disable-line no-console
          return Promise.reject(err)
        })
    }
  }),
  withStyles(styles)
)
