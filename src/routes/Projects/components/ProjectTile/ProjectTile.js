import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import Tooltip from 'material-ui/Tooltip'
import IconButton from 'material-ui/IconButton'
// import Button from 'material-ui/Button'
import DeleteIcon from 'material-ui-icons/Delete'
import AddPersonIcon from 'material-ui-icons/GroupAdd'
import PersonIcon from 'material-ui-icons/Person'
import SharingDialog from '../SharingDialog'
import { get, map } from 'lodash'
import moment from 'moment'
import Menu, { MenuItem } from 'material-ui/Menu'
import MoreVertIcon from 'material-ui-icons/MoreVert'
import { ListItemIcon, ListItemText } from 'material-ui/List'
import EditIcon from 'material-ui-icons/ModeEdit'
import classes from './ProjectTile.scss'

export const ProjectTile = ({
  open,
  project,
  onSelect,
  onDelete,
  displayNames,
  menuClick,
  closeMenu,
  anchorEl,
  sharingDialogOpen,
  toggleSharingDialog
}) => (
  <Paper className={classes.container} open={open}>
    <div className={classes.top}>
      <span className={classes.name} onClick={() => onSelect(project)}>
        {project.name}
      </span>
      <div>
        <IconButton onClick={menuClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeMenu}>
          <MenuItem onClick={() => onSelect(project)}>
            <ListItemIcon className={classes.icon}>
              <EditIcon />
            </ListItemIcon>
            <ListItemText inset primary="Edit" />
          </MenuItem>
          <MenuItem onClick={onDelete}>
            <ListItemIcon className={classes.icon}>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText inset primary="Delete" />
          </MenuItem>
        </Menu>
      </div>
    </div>
    {project.createdAt ? (
      <span className={classes.createdAt}>
        {moment(project.createdAt).format('MM/DD/YY')}
      </span>
    ) : null}
    <div className="flex-column">
      <Tooltip title="Add Collaborators" placement="bottom">
        <IconButton onClick={toggleSharingDialog}>
          <AddPersonIcon />
        </IconButton>
      </Tooltip>
      {project.collaborators ? (
        <div className="flex-row">
          {map(project.collaborators, (collab, collabId) => (
            <Tooltip
              key={`collab-${collabId}`}
              title={get(displayNames, collabId, 'Collaborator')}>
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
  displayNames: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
  menuClick: PropTypes.func.isRequired,
  closeMenu: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  anchorEl: PropTypes.object,
  toggleSharingDialog: PropTypes.func,
  sharingDialogOpen: PropTypes.bool,
  open: PropTypes.bool
}

export default ProjectTile
