import React from 'react'
import PropTypes from 'prop-types'
import { capitalize } from 'lodash'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import LayersIcon from '@material-ui/icons/Layers'
import enhance from './SidebarList.enhnacer'

// Fix issue with padding
const listItemStyle = {
  paddingLeft: '18px'
}

export const SidebarList = ({
  classes,
  drawerOpen,
  itemIsActive,
  optionsConfig,
  goTo,
  toggleDrawer
}) => (
  <List className={classes.list}>
    {optionsConfig.map(({ value, iconElement, label }, i) => (
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
    <ListItem button selected onClick={toggleDrawer} style={listItemStyle}>
      <ListItemIcon>
        {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </ListItemIcon>
    </ListItem>
  </List>
)

SidebarList.propTypes = {
  toggleDrawer: PropTypes.func,
  itemIsActive: PropTypes.func,
  goTo: PropTypes.func,
  optionsConfig: PropTypes.array,
  classes: PropTypes.object, // added by withStyles
  drawerOpen: PropTypes.bool
}

export default enhance(SidebarList)
