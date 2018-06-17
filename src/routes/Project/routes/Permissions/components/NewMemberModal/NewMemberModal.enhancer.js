import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withHandlers, setPropTypes } from 'recompose'
import { reduxForm } from 'redux-form'
import { withNotifications } from 'modules/notification'

export default compose(
  reduxForm({
    form: 'newMember'
  }),
  withNotifications,
  setPropTypes({
    onNewMemberClick: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  }),
  withHandlers({
    closeAndReset: ({ reset, onRequestClose }) => () => {
      reset()
      onRequestClose && onRequestClose()
    },
    callSubmit: props => value => {
      props.onNewMemberClick()
    }
  })
)
