import { get } from 'lodash'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withHandlers, setPropTypes } from 'recompose'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { currentUserProjectPermissions } from 'selectors'
import { withStyles } from '@material-ui/core'
import styles from './EditEnvironmentDialog.styles'

export default compose(
  reduxForm({
    form: 'editEnvironment',
    enableReinitialize: true // needed is modal does not unmount once opening
  }),
  setPropTypes({
    reset: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    projectId: PropTypes.string.isRequired
  }),
  connect((state, props) => {
    const permissionsByType = currentUserProjectPermissions(state, props)
    return {
      envUpdateDisabled: get(permissionsByType, 'update.environments') !== true
    }
  }),
  withHandlers({
    closeAndReset: ({ reset, onRequestClose }) => value => {
      reset()
      onRequestClose && onRequestClose()
    }
  }),
  // Styles as props.classes
  withStyles(styles)
)
