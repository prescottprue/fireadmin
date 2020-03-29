import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import { compose } from 'redux'
import { setPropTypes, withHandlers } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import { NEW_ROLE_FORM_NAME } from 'constants/formNames'
import styles from './NewRoleCard.styles'

export default compose(
  reduxForm({ form: NEW_ROLE_FORM_NAME }),
  setPropTypes({
    onSubmit: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired // from reduxForm
  }),
  withHandlers({
    closeAndReset: (props) => (value) => {
      props.reset()
      props.onRequestClose()
    }
  }),
  withStyles(styles)
)
