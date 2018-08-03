import { size } from 'lodash'
import { compose } from 'redux'
import { withStateHandlers, withProps } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import styles from './ProjectTile.styles'

export default compose(
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
  ),
  withProps(({ project }) => ({
    numberOfCollaborators: size(project.collaborators)
  })),
  withStyles(styles)
)
