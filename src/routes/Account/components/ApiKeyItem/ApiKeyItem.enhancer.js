import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { withHandlers } from 'recompose'
import { setStringToClipboard } from 'utils/browser'
import { withNotifications } from 'modules/notification'
import styles from './ApiKeyItem.styles'

export default compose(
  withNotifications,
  withHandlers({
    copyApiKey: ({ apiKey, showSuccess }) => () => {
      setStringToClipboard(apiKey)
      showSuccess('Successfully copied API Key')
    }
  }),
  withStyles(styles)
)
