import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui-next/Paper'
import IconButton from 'material-ui/IconButton'
// import Button from 'material-ui-next/Button'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import AddPersonIcon from 'material-ui/svg-icons/social/group-add'
import PersonIcon from 'material-ui/svg-icons/social/person'
import SharingDialog from '../SharingDialog'
import { get } from 'lodash'
import moment from 'moment'
import classes from './ProjectTile.scss'

export const ProjectTile = ({
  open,
  project,
  onSelect,
  onDelete,
  users,
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
    {project.createdAt ? (
      <span className={classes.createdAt}>
        {moment(project.createdAt).format('MM/DD/YY')}
      </span>
    ) : null}
    <div className="flex-column">
      <IconButton onClick={toggleSharingDialog} tooltip="Add Collaborators">
        <AddPersonIcon />
      </IconButton>
      {project.collaborators ? (
        <div className="flex-row">
          {project.collaborators.map((collab, idx) => (
            <IconButton
              key={`collab-${collab.id}-${idx}`}
              onClick={toggleSharingDialog}
              tooltip={get(
                users,
                `${collab.id}.displayName`,
                `Collab ${idx + 1}`
              )}>
              <PersonIcon />
            </IconButton>
          ))}
        </div>
      ) : null}
    </div>
    <SharingDialog
      open={sharingDialogOpen}
      project={project}
      onRequestClose={toggleSharingDialog}
    />
  </Paper>
)

ProjectTile.propTypes = {
  project: PropTypes.object.isRequired,
  users: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  toggleSharingDialog: PropTypes.func,
  sharingDialogOpen: PropTypes.bool,
  open: PropTypes.bool
}

export default ProjectTile
