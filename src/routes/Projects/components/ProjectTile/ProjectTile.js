import React, { useState } from 'react'
import PropTypes from 'prop-types'
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
import { LIST_PATH } from 'constants/paths'
import { useHistory } from 'react-router-dom'
import SharingDialog from '../SharingDialog'
import styles from './ProjectTile.styles'

const useStyles = makeStyles(styles)

function ProjectTile({ project, onDelete, projectId }) {
  const classes = useStyles()
  const history = useHistory()

  const [anchorEl, changeAnchorEl] = useState(null)
  const [sharingDialogOpen, changeSharingDialogOpen] = useState(false)
  const closeMenu = () => changeAnchorEl(null)
  const menuClick = (e) => changeAnchorEl(e.target)
  const toggleSharingDialog = () => changeSharingDialogOpen(!sharingDialogOpen)
  const handleEditClick = () => history.push(`${LIST_PATH}/${projectId}`)

  return (
    <Paper
      className={classes.container}
      data-test="project-tile"
      data-test-id={projectId}>
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
          {formatDate(project.createdAt)}
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
  projectId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default ProjectTile
