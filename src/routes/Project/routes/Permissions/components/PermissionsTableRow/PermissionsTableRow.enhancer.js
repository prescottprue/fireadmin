import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { setPropTypes, withStateHandlers } from 'recompose'
import { reduxForm } from 'redux-form'
import { withStyles } from '@material-ui/core/styles'
import styles from './PermissionsTableRow.styles'
import { getRoleOptions } from 'selectors'

export default compose(
  setPropTypes({
    projectId: PropTypes.string.isRequired,
    form: PropTypes.string.isRequired
  }),
  reduxForm({
    enableReinitialize: true
  }),
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
        deleteDialogOpen: true
      }),
      handleDeleteClose: () => () => ({
        deleteDialogOpen: false
      })
    }
  ),
  connect((state, props) => ({
    roleOptions: getRoleOptions(state, props)
  })),
  withStyles(styles)
)
