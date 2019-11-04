import React, { useState } from 'react'
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
import { makeStyles } from '@material-ui/core/styles'
import { paths } from 'constants/paths'
import styles from './ActionTemplateListCard.styles'

const useStyles = makeStyles(styles)

function ActionTemplateListCard({ name, id, steps, onClick, description }) {
  const classes = useStyles()
  const [anchorEl, changeMenuState] = useState(null)

  function menuClick(e) {
    changeMenuState(e.target)
  }
  function closeMenu() {
    changeMenuState(null)
  }
  const truncatedDescription =
    description &&
    `${description.substring(0, 85)}${description.length >= 85 ? '...' : ''}`

  return (
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
                <ListItemText primary="Edit" />
              </MenuItem>
              <MenuItem disabled>
                <ListItemIcon className={classes.icon}>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText primary="Remove" />
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
  id: PropTypes.string.isRequired,
  name: PropTypes.string, // from enhancer (flattenProp - template)
  steps: PropTypes.array // from enhancer (flattenProp - template)
}

export default ActionTemplateListCard
