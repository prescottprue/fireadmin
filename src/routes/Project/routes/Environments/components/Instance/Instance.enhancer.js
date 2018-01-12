import { compose } from 'redux'
import { withStateHandlers, withProps } from 'recompose'

export default compose(
  withStateHandlers(
    ({ initialAnchorEl = null }) => ({
      anchorEl: initialAnchorEl
    }),
    {
      closeMenu: () => () => ({
        anchorEl: null
      }),
      menuClick: () => e => ({
        anchorEl: e.target
      })
    }
  ),
  withProps(({ onEditClick, closeMenu }) => ({
    editAndClose: () => {
      closeMenu()
      onEditClick()
    }
  }))
)
