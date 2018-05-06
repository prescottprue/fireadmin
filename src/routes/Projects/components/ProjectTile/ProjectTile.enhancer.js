import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStateHandlers } from 'recompose'

export default compose(
  connect(({ firebase: { data: { displayNames } } }, { params }) => ({
    displayNames
  })),
  withStateHandlers(
    ({ initialDialogOpen = false, initialAnchorEl = null }) => ({
      sharingDialogOpen: initialDialogOpen,
      anchorEl: initialAnchorEl
    }),
    {
      toggleSharingDialog: ({ sharingDialogOpen }) => action => ({
        sharingDialogOpen: !sharingDialogOpen,
        selectedInstance: action
      }),
      toggleDialog: ({ sharingDialogOpen }) => () => ({
        sharingDialogOpen: !sharingDialogOpen
      }),
      closeMenu: () => () => ({
        anchorEl: null
      }),
      menuClick: () => e => ({
        anchorEl: e.target
      })
    }
  )
)
