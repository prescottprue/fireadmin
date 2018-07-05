import { get } from 'lodash'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withHandlers, setPropTypes } from 'recompose'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { currentUserPermissionsByType } from 'selectors'

export default compose(
  reduxForm({
    form: 'editEnvironment'
  }),
  setPropTypes({
    reset: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    projectId: PropTypes.string.isRequired
  }),
  connect((state, props) => {
    const permissionsByType = currentUserPermissionsByType(state, props)
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
