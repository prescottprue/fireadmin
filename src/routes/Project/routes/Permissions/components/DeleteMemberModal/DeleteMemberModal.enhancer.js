import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withHandlers, setPropTypes } from 'recompose'

export default compose(
  setPropTypes({
    onRemoveClick: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired
  }),
  withHandlers({
    removeAndClose: ({ onRequestClose, onRemoveClick, uid }) => value => {
      onRequestClose && onRequestClose()
      onRemoveClick && onRemoveClick(uid)
    }
  })
)
