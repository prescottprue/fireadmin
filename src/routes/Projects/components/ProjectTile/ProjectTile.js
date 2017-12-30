import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui-next/Paper'
import Tooltip from 'material-ui-next/Tooltip'
import IconButton from 'material-ui-next/IconButton'
// import Button from 'material-ui-next/Button'
import DeleteIcon from 'material-ui-icons/Delete'
import AddPersonIcon from 'material-ui-icons/GroupAdd'
import PersonIcon from 'material-ui-icons/Person'
import SharingDialog from '../SharingDialog'
import { get, map } from 'lodash'
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
        <Tooltip title="Delete Project">
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </div>
    {project.createdAt ? (
      <span className={classes.createdAt}>
        {moment(project.createdAt).format('MM/DD/YY')}
      </span>
    ) : null}
    <div className="flex-column">
      <Tooltip title="Add Collaborators">
        <IconButton onClick={toggleSharingDialog}>
          <AddPersonIcon />
        </IconButton>
      </Tooltip>
      {project.collaborators ? (
        <div className="flex-row">
          {map(project.collaborators, (collab, collabId) => (
            <Tooltip
              key={`collab-${collabId}`}
              title={get(users, `${collabId}.displayName`, 'Collaborator')}>
              <IconButton onClick={toggleSharingDialog}>
                <PersonIcon />
              </IconButton>
            </Tooltip>
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
