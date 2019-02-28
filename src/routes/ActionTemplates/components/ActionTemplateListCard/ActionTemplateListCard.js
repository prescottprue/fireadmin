import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { size } from 'lodash'
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
import { paths } from 'constants/paths'

export const ActionTemplateListCard = ({
  name,
  id,
  truncatedDescription,
  steps,
  expanded,
  onClick,
  menuClick,
  anchorEl,
  closeMenu,
  classes
}) => (
  <Card className={classes.card}>
    <CardHeader
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
            <MenuItem onClick={onClick}>
              <ListItemIcon className={classes.icon}>
                <EditIcon />
              </ListItemIcon>
              <ListItemText inset primary="Edit" />
            </MenuItem>
            <MenuItem disabled>
              <ListItemIcon className={classes.icon}>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText inset primary="Remove" />
            </MenuItem>
          </Menu>
        </div>
      }
      title={
        <Link
          to={`${paths.actionTemplates}/${id}`}
          className={classes.cardTitle}>
          {name}
        </Link>
      }
      subheader={`${size(steps)} Steps`}
      classes={{ title: classes.cardTitle }}
    />
    <CardContent className={classes.media}>
      <Typography component="p">{truncatedDescription}</Typography>
    </CardContent>
  </Card>
)

ActionTemplateListCard.propTypes = {
  expanded: PropTypes.bool,
  onClick: PropTypes.func,
  id: PropTypes.string.isRequired,
  menuClick: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  closeMenu: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  anchorEl: PropTypes.object, // from enhancer (withStateHandlers)
  name: PropTypes.string, // from enhancer (flattenProp - template)
  steps: PropTypes.array, // from enhancer (flattenProp - template)
  truncatedDescription: PropTypes.string, // from enhancer (withProps)
  classes: PropTypes.object.isRequired // from enhancer (withStyles - template)
}

export default ActionTemplateListCard
