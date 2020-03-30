import React, { useState } from 'react'
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
import { makeStyles } from '@material-ui/core/styles'
import { databaseURLToProjectName } from 'utils'
import styles from './Instance.styles'

const useStyles = makeStyles(styles)

function Instance({ instanceId, onRemoveClick, onEditClick, instance }) {
  const classes = useStyles()
  const [anchorEl, changeDialogState] = useState(null)
  const projectId = databaseURLToProjectName(get(instance, 'databaseURL', ''))
  const instanceName = get(instance, 'name', '')
  const originalDesc = get(instance, 'description', '')
  const instanceDescription = originalDesc.length
    ? originalDesc.length > 50
      ? originalDesc.substring(0, 50).concat('...')
      : originalDesc
    : null
  const openMenu = (e) => changeDialogState(e.target)
  const closeMenu = () => changeDialogState(null)

  function editAndClose() {
    typeof onEditClick === 'function' && onEditClick()
    changeDialogState(null)
  }

  function removeAndClose() {
    typeof onRemoveClick === 'function' && onRemoveClick()
    changeDialogState(null)
  }

  return (
    <Card className={classes.card} data-test={`environment-${instanceId}`}>
      <CardHeader
        title={
          <Typography
            onClick={onEditClick}
            variant="h5"
            className={classes.title}>
            {instanceName}
          </Typography>
        }
        subheader={projectId}
        action={
          <div>
            <IconButton onClick={openMenu} data-test="environment-tile-more">
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
                          <ListItemText primary="Edit" />
                        </MenuItem>
                        <MenuItem
                          onClick={removeAndClose}
                          data-test="delete-environment-button">
                          <ListItemIcon className={classes.icon}>
                            <DeleteIcon />
                          </ListItemIcon>
                          <ListItemText primary="Remove" />
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
        <CardContent className={classes.content}>
          <Typography>{instanceDescription}</Typography>
        </CardContent>
      )}
    </Card>
  )
}

Instance.propTypes = {
  onRemoveClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  instanceId: PropTypes.string.isRequired
}

export default Instance
