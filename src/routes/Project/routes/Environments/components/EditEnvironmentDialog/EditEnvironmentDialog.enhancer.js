import { get } from 'lodash'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withHandlers, setPropTypes } from 'recompose'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { currentUserProjectPermissions } from 'selectors'

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
      lockEnvDisabled: get(permissionsByType, 'update.environments') !== true
    }
  }),
  withHandlers({
    closeAndReset: ({ reset, onRequestClose }) => value => {
      reset()
      onRequestClose && onRequestClose()
    }
  })
)
