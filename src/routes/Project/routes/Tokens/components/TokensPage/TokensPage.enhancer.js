import { compose } from 'redux'
import firebase from 'firebase/app'
import { withStyles } from '@material-ui/core/styles'
import { withHandlers, withStateHandlers } from 'recompose'
import { setStringToClipboard } from 'utils/browser'
import styles from './TokensPage.styles'

export default compose(
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
        .httpsCallable('generateAuthToken')({ projectId })
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
