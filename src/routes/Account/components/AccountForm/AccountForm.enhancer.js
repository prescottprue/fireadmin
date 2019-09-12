import { compose } from 'redux'
import { reduxForm } from 'redux-form'
import { ACCOUNT_FORM_NAME } from 'constants'
import { withStyles } from '@material-ui/core/styles'
import styles from './AccountForm.styles'

export default compose(
  reduxForm({ form: ACCOUNT_FORM_NAME }),
  withStyles(styles)
)
