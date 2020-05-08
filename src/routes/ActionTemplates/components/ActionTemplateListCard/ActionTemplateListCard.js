import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { size } from 'lodash'
import { useUser } from 'reactfire'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { makeStyles } from '@material-ui/core/styles'
import { ACTION_TEMPLATES_PATH as ACTION_TEMPLATES_ROUTE } from 'constants/paths'

import styles from './ActionTemplateListCard.styles'

const useStyles = makeStyles(styles)

function ActionTemplateListCard({
  name,
  id,
  steps,
  public: isPublic,
  createdBy,
  description,
  onClick,
  onDeleteClick
}) {
  const classes = useStyles()
  const user = useUser()

  const actionsDisabled = createdBy !== user?.uid

  const [anchorEl, changeMenuState] = useState(null)
  function menuClick(e) {
    changeMenuState(e.target)
  }
  function closeMenu() {
    changeMenuState(null)
  }
  function deleteClick() {
    changeMenuState(null)
    onDeleteClick({ id, name })
  }
  const truncatedDescription =
    description &&
    `${description.substring(0, 85)}${description.length >= 85 ? '...' : ''}`
  const isPublicKey = isPublic ? 'public' : 'private'
  return (
    <Card
      className={classes.card}
      data-test={`action-template-card-${isPublicKey}`}>
      <CardHeader
        action={
          <>
            <IconButton
              onClick={menuClick}
              data-test={`action-template-card-${isPublicKey}-actions`}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={closeMenu}>
              <MenuItem
                to={`${ACTION_TEMPLATES_ROUTE}/${id}`}
                component={Link}
                disabled={actionsDisabled}
                data-test="action-template-edit">
                <ListItemIcon className={classes.icon}>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText primary="Edit" />
              </MenuItem>
              <MenuItem
                disabled={actionsDisabled}
                onClick={deleteClick}
                data-test="action-template-delete">
                <ListItemIcon className={classes.icon}>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText primary="Remove" />
              </MenuItem>
            </Menu>
          </>
        }
        title={
          <Link
            to={`${ACTION_TEMPLATES_ROUTE}/${id}`}
            className={classes.cardTitle}
            data-test={`action-template-title-${id}`}>
            {name}
          </Link>
        }
        subheader={`${size(steps)} Steps`}
        classes={{ title: classes.cardTitle, subheader: classes.cardSubheader }}
      />
      <CardContent className={classes.media}>
        <Typography component="p">{truncatedDescription}</Typography>
      </CardContent>
    </Card>
  )
}

ActionTemplateListCard.propTypes = {
  onClick: PropTypes.func,
  public: PropTypes.bool,
  onDeleteClick: PropTypes.func,
  createdBy: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  description: PropTypes.string,
  name: PropTypes.string,
  steps: PropTypes.array
}

export default ActionTemplateListCard
