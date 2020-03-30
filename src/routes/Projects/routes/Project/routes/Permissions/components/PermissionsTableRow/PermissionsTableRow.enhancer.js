import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  setPropTypes,
  withStateHandlers,
  withHandlers,
  setDisplayName
} from 'recompose'
import { reduxForm } from 'redux-form'
import { withStyles } from '@material-ui/core/styles'
import { getRoleOptions } from 'selectors'
import styles from './PermissionsTableRow.styles'

export default compose(
  setDisplayName('EnhancedPermissionsTableRow'),
  setPropTypes({
    projectId: PropTypes.string.isRequired,
    form: PropTypes.string.isRequired,
    onDeleteClick: PropTypes.func.isRequired
  }),
  reduxForm({
    enableReinitialize: true
  }),
  withStateHandlers(
    () => ({
      anchorEl: null
    }),
    {
      handleMenuClick: () => (e) => ({
        anchorEl: e.target
      }),
      handleMenuClose: () => () => ({
        anchorEl: null
      })
    }
  ),
  connect((state, props) => ({
    roleOptions: getRoleOptions(state, props)
  })),
  withHandlers({
    closeAndCallDelete: (props) => () => {
      props.handleMenuClose()
      props.onDeleteClick(props.uid)
    }
  }),
  withStyles(styles)
)
