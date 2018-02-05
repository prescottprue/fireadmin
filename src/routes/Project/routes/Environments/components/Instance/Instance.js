import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import Card, { CardHeader, CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import Menu, { MenuItem } from 'material-ui/Menu'
import { ListItemIcon, ListItemText } from 'material-ui/List'
import MoreVertIcon from 'material-ui-icons/MoreVert'
import DeleteIcon from 'material-ui-icons/Delete'
import EditIcon from 'material-ui-icons/ModeEdit'
import classes from './Instance.scss'

const databaseURLToProjectName = databaseURL =>
  databaseURL.replace('https://', '').replace('.firebaseio.com', '')

export const Instance = ({
  instance,
  anchorEl,
  closeMenu,
  onRemoveClick,
  menuClick,
  editAndClose,
  onEditClick
}) => (
  <Card className={classes.card}>
    <CardHeader
      title={
        <span onClick={onEditClick} className={classes.title}>
          {instance.name}
        </span>
      }
      subheader={databaseURLToProjectName(get(instance, 'databaseURL', ''))}
      action={
        <div>
          <IconButton onClick={menuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={closeMenu}>
            <MenuItem onClick={editAndClose}>
              <ListItemIcon className={classes.icon}>
                <EditIcon />
              </ListItemIcon>
              <ListItemText inset primary="Edit" />
            </MenuItem>
            <MenuItem onClick={onRemoveClick}>
              <ListItemIcon className={classes.icon}>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText inset primary="Remove" />
            </MenuItem>
          </Menu>
        </div>
      }
    />
    <CardContent>
      <Typography>{get(instance, 'description', null)}</Typography>
    </CardContent>
  </Card>
)

Instance.propTypes = {
  instance: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onRemoveClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  editAndClose: PropTypes.func.isRequired,
  menuClick: PropTypes.func.isRequired,
  closeMenu: PropTypes.func.isRequired,
  anchorEl: PropTypes.object
}

export default Instance
