import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withHandlers, setPropTypes } from 'recompose'

export default compose(
  // Proptypes for props used in HOCs including withHandlers
  setPropTypes({
    onDeleteClick: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired
  }),
  // Add handlers as props
  withHandlers({
    removeAndClose: ({ onRequestClose, onDeleteClick, name }) => value => {
      onRequestClose && onRequestClose()
      onDeleteClick && onDeleteClick(name)
    }
  })
)
