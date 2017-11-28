import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui-next/Paper'
import IconButton from 'material-ui/IconButton'
// import Button from 'material-ui-next/Button'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import SocialIcon from 'material-ui/svg-icons/social/people'
import SharingDialog from '../SharingDialog'
import { isObject } from 'lodash'
import classes from './ProjectTile.scss'

export const ProjectTile = ({
  open,
  project,
  onSelect,
  onDelete,
  sharingDialogOpen,
  toggleSharingDialog
}) => (
  <Paper className={classes.container} open={open}>
    <div className={classes.top}>
      <span className={classes.name} onClick={() => onSelect(project)}>
        {project.name}
      </span>
      {onDelete ? (
        <IconButton tooltip="delete" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      ) : null}
    </div>
    <span className={classes.owner}>
      {isObject(project.createdBy)
        ? project.createdBy.displayName
        : project.createdBy || 'No Owner'}
    </span>
    <IconButton onClick={toggleSharingDialog}>
      <SocialIcon />
    </IconButton>
    <SharingDialog
      open={sharingDialogOpen}
      project={project}
      onRequestClose={toggleSharingDialog}
    />
  </Paper>
)

ProjectTile.propTypes = {
  project: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  toggleSharingDialog: PropTypes.func,
  sharingDialogOpen: PropTypes.bool,
  open: PropTypes.bool
}

export default ProjectTile
