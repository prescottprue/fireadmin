import PropTypes from 'prop-types'
import { compose } from 'redux'
import { setPropTypes, withStateHandlers } from 'recompose'
import { reduxForm } from 'redux-form'
import { withStyles } from '@material-ui/core/styles'
import styles from './RolesTableRow.styles'

export default compose(
  setPropTypes({
    onSubmit: PropTypes.func.isRequired,
    form: PropTypes.string.isRequired
  }),
  // Add form capabilities (name passed as prop)
  reduxForm(),
  withStateHandlers(
    () => ({
      anchorEl: null,
      deleteDialogOpen: false
    }),
    {
      handleMenuClick: () => e => ({
        anchorEl: e.target
      }),
      handleMenuClose: () => () => ({
        anchorEl: null
      }),
      startDelete: () => () => ({
        deleteDialogOpen: true,
        anchorEl: null
      }),
      handleDeleteClose: () => () => ({
        deleteDialogOpen: false
      })
    }
  ),
  withStyles(styles)
)
