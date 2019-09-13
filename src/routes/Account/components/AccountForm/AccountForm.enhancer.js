import { compose } from 'redux'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { ACCOUNT_FORM_NAME } from 'constants'
import { withStyles } from '@material-ui/core/styles'
import styles from './AccountForm.styles'

export default compose(
  connect(({ firebase: { auth } }) => ({
    // get profile from redux state
    uid: auth.uid
  })),
  reduxForm({ form: ACCOUNT_FORM_NAME }),
  withStyles(styles)
)
