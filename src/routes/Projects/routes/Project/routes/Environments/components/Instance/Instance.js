import React from 'react'
import PropTypes from 'prop-types'
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

function Instance({
  projectId,
  instanceName,
  instanceId,
  classes,
  anchorEl,
  closeMenu,
  menuClick,
  removeAndClose,
  editAndClose,
  instanceDescription,
  onEditClick
}) {
  return (
    <Card className={classes.card} data-test={`environment-${instanceId}`}>
      <CardHeader
        title={
          <span onClick={onEditClick} className={classes.title}>
            {instanceName}
          </span>
        }
        subheader={projectId}
        action={
          <div>
            <IconButton onClick={menuClick} data-test="environment-tile-more">
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
                        <MenuItem
                          onClick={editAndClose}
                          data-test="edit-environment-button">
                          <ListItemIcon className={classes.icon}>
                            <EditIcon />
                          </ListItemIcon>
                          <ListItemText inset primary="Edit" />
                        </MenuItem>
                        <MenuItem
                          onClick={removeAndClose}
                          data-test="delete-environment-button">
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
}

Instance.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  projectId: PropTypes.string.isRequired, // from enhancer (withProps)
  instanceName: PropTypes.string.isRequired, // from enhancer (withProps)
  instanceDescription: PropTypes.string, // from enhancer (withProps)
  removeAndClose: PropTypes.func.isRequired, // from enhancer (withHandlers)
  editAndClose: PropTypes.func.isRequired, // from enhancer (withHandlers)
  menuClick: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  closeMenu: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  anchorEl: PropTypes.object, // from enhancer (withStateHandlers)
  onEditClick: PropTypes.func.isRequired,
  instanceId: PropTypes.string.isRequired
}

export default Instance
