import React from 'react'
import PropTypes from 'prop-types'
import { capitalize } from 'lodash'
import { useHistory, useParams, useLocation } from 'react-router-dom'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { makeStyles } from '@material-ui/core/styles'
import LayersIcon from '@material-ui/icons/Layers'
import { LIST_PATH } from 'constants/paths'
import sidebarOptions from './sidebarOptions'
import styles from './SidebarLayout.styles'

// Fix issue with padding
const listItemStyle = {
  paddingLeft: '18px'
}

const useStyles = makeStyles(styles)

function SidebarList({ drawerOpen, toggleDrawer }) {
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()
  const { projectId } = useParams()
  const goTo = (value) => history.push(`${LIST_PATH}/${projectId}/${value}`)
  const itemIsActive = (value) => {
    const currentParentRoute = `${LIST_PATH}/${projectId}/`
    return value === ''
      ? `${location.pathname}/` === currentParentRoute ||
          location.pathname === currentParentRoute
      : location.pathname.endsWith(value)
  }
  return (
    <List className={classes.list}>
      {sidebarOptions.map(({ value, iconElement, label }, i) => (
        <ListItem
          button
          key={`SidebarItem-${i}-${value}`}
          selected={itemIsActive(value)}
          className={itemIsActive(value) ? classes.activeListItem : undefined}
          onClick={() => goTo(value)}
          style={listItemStyle}>
          <ListItemIcon>{iconElement || <LayersIcon />}</ListItemIcon>
          <ListItemText primary={label || capitalize(value)} />
        </ListItem>
      ))}
      <Divider />
      <Divider />
      <ListItem button onClick={toggleDrawer} style={listItemStyle}>
        <ListItemIcon>
          {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </ListItemIcon>
      </ListItem>
    </List>
  )
}

SidebarList.propTypes = {
  toggleDrawer: PropTypes.func.isRequired,
  drawerOpen: PropTypes.bool.isRequired
}

export default SidebarList
