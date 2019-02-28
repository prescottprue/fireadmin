import { get, size } from 'lodash'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import {
  withStateHandlers,
  withHandlers,
  withProps,
  setPropTypes
} from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import styles from './ProjectTile.styles'
import * as handlers from './ProjectTile.handlers'

export default compose(
  // State handlers as props
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
  // Set proptypes used in HOCs
  setPropTypes({
    project: PropTypes.object.isRequired, // used in handlers
    onSelect: PropTypes.func.isRequired // used in handlers
  }),
  // Handlers as props
  withHandlers(handlers),
  withProps(({ project }) => ({
    numberOfCollaborators: size(get(project, 'collaborators'))
  })),
  // Add styles as props.classes
  withStyles(styles)
)
