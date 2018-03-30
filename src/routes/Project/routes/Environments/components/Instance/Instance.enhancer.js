import { get } from 'lodash'
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
  withProps(({ onEditClick, closeMenu, instance }) => {
    const originalDesc = get(instance, 'description', '')
    return {
      editAndClose: () => {
        closeMenu()
        onEditClick()
      },
      instanceDescription: originalDesc.length
        ? originalDesc.length > 50
          ? originalDesc.substring(0, 50).concat('...')
          : originalDesc
        : null
    }
  })
)
