import PropTypes from 'prop-types'
import { compose } from 'redux'
import { setPropTypes } from 'recompose'
import { reduxForm } from 'redux-form'
import { formNames } from 'constants'
import { withStyles } from '@material-ui/core/styles'
import styles from './RolesTableRow.styles'

export default compose(
  setPropTypes({
    onSubmit: PropTypes.func.isRequired
  }),
  reduxForm({ form: formNames.projectRoles }),
  withStyles(styles)
)
