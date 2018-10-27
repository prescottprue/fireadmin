import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuList from '@material-ui/core/MenuList'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import { databaseURLToProjectName } from 'utils'
import classes from './Instance.scss'

export const Instance = ({
  instance,
  anchorEl,
  closeMenu,
  menuClick,
  removeAndClose,
  editAndClose,
  instanceDescription,
  onEditClick
}) => (
  <Card className={classes.card}>
    <CardHeader
      title={
        <span onClick={onEditClick} className={classes.title}>
          {get(instance, 'name', '')}
        </span>
      }
      subheader={databaseURLToProjectName(get(instance, 'databaseURL', ''))}
      action={
        <div>
          <IconButton onClick={menuClick}>
            <MoreVertIcon />
          </IconButton>
          <Popper
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            transition
            placement="right-start">
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{
                  transformOrigin:
                    placement === 'bottom' ? 'left top' : 'right bottom'
                }}>
                <Paper>
                  <ClickAwayListener onClickAway={closeMenu}>
                    <MenuList>
                      <MenuItem onClick={editAndClose}>
                        <ListItemIcon className={classes.icon}>
                          <EditIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Edit" />
                      </MenuItem>
                      <MenuItem onClick={removeAndClose}>
                        <ListItemIcon className={classes.icon}>
                          <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Remove" />
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      }
    />
    {instanceDescription && (
      <CardContent>
        <Typography>{instanceDescription}</Typography>
      </CardContent>
    )}
  </Card>
)

Instance.propTypes = {
  instance: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  removeAndClose: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  editAndClose: PropTypes.func.isRequired,
  instanceDescription: PropTypes.string,
  menuClick: PropTypes.func.isRequired,
  closeMenu: PropTypes.func.isRequired,
  anchorEl: PropTypes.object
}

export default Instance
