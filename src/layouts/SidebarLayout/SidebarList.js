import React from 'react'
import PropTypes from 'prop-types'
import { capitalize } from 'lodash'
import Divider from 'material-ui/Divider'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import ChevronRightIcon from 'material-ui-icons/ChevronRight'
import LayersIcon from 'material-ui-icons/Layers'
import enhance from './SidebarList.enhnacer'

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
        style={{ paddingLeft: '20px' }}>
        <ListItemIcon>{iconElement || <LayersIcon />}</ListItemIcon>
        <ListItemText primary={label || capitalize(value)} />
      </ListItem>
    ))}
    <Divider />
    <Divider />
    <ListItem button selected onClick={toggleDrawer}>
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
