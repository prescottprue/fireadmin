import { get, isBoolean, mapValues } from 'lodash'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withHandlers, setPropTypes } from 'recompose'
import { connect } from 'react-redux'
import { reduxForm, formValueSelector } from 'redux-form'
import { currentUserProjectPermissions } from 'selectors'
import { withStyles } from '@material-ui/core'
import styles from './EditEnvironmentDialog.styles'

const formName = 'editEnvironment'

const selector = formValueSelector(formName)

export default compose(
  reduxForm({
    form: formName,
    enableReinitialize: true // needed is modal does not unmount once opening
  }),
  setPropTypes({
    reset: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    projectId: PropTypes.string.isRequired
  }),
  connect((state, props) => {
    const permissionsByType = currentUserProjectPermissions(state, props)
    const envUpdateDisabled =
      get(permissionsByType, 'update.environments') !== true
    const formValues = selector(state, 'readOnly', 'writeOnly', 'locked')
    const {
      locked = false,
      writeOnly = false,
      readOnly = false
    } = mapValues(formValues, (val) => (!isBoolean(val) ? false : val))
    return {
      lockedDisabled: envUpdateDisabled || writeOnly || readOnly,
      readOnlyDisabled: envUpdateDisabled || locked || writeOnly,
      writeOnlyDisabled: envUpdateDisabled || locked || readOnly
    }
  }),
  withHandlers({
    closeAndReset: ({ reset, onRequestClose }) => (value) => {
      reset()
      onRequestClose && onRequestClose()
    }
  }),
  // Styles as props.classes
  withStyles(styles)
)
