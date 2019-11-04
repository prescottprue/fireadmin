import React from 'react'
import PropTypes from 'prop-types'
import { invoke } from 'lodash'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import DeleteIcon from '@material-ui/icons/Delete'
import PeopleIcon from '@material-ui/icons/People'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import EditIcon from '@material-ui/icons/Edit'
import { makeStyles } from '@material-ui/core/styles'
import { formatDate } from 'utils/formatters'
import SharingDialog from '../SharingDialog'
import styles from './ProjectTile.styles'

const useStyles = makeStyles(styles)

function ProjectTile({
  open,
  project,
  handleEditClick,
  onDelete,
  menuClick,
  closeMenu,
  anchorEl,
  sharingDialogOpen,
  toggleSharingDialog
}) {
  const classes = useStyles()

  return (
    <Paper className={classes.container} open={open} data-test="project-tile">
      <div className={classes.top}>
        <Typography
          className={classes.name}
          onClick={handleEditClick}
          data-test="project-tile-name">
          {project.name}
        </Typography>
        <IconButton onClick={menuClick} data-test="project-tile-more">
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="edit-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeMenu}>
          <MenuItem onClick={handleEditClick} data-test="project-tile-edit">
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </MenuItem>
          <MenuItem onClick={onDelete} data-test="project-tile-delete">
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </MenuItem>
        </Menu>
      </div>
      {project.createdAt ? (
        <span className={classes.createdAt}>
          {formatDate(invoke(project.createdAt, 'toDate'))}
        </span>
      ) : null}
      <div className="flex-column">
        <Tooltip title="Collaborators" placement="bottom">
          <IconButton onClick={toggleSharingDialog}>
            <PeopleIcon />
          </IconButton>
        </Tooltip>
      </div>
      <SharingDialog
        open={sharingDialogOpen}
        project={project}
        onRequestClose={toggleSharingDialog}
      />
    </Paper>
  )
}

ProjectTile.propTypes = {
  project: PropTypes.object.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  menuClick: PropTypes.func.isRequired,
  closeMenu: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  anchorEl: PropTypes.object,
  toggleSharingDialog: PropTypes.func,
  sharingDialogOpen: PropTypes.bool,
  open: PropTypes.bool
}

export default ProjectTile
