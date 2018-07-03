import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import { formNames } from 'constants'
import { compose } from 'redux'
import { setPropTypes, withHandlers } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import styles from './NewRoleCard.styles'

export default compose(
  reduxForm({ form: formNames.newRole }),
  setPropTypes({
    onSubmit: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired // from reduxForm
  }),
  withHandlers({
    closeAndReset: props => value => {
      props.reset()
      props.onRequestClose()
    }
  }),
  withStyles(styles)
)
