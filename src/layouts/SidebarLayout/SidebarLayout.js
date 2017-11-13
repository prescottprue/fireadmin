import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Drawer from 'material-ui-next/Drawer'
import AppBar from 'material-ui-next/AppBar'
import Toolbar from 'material-ui-next/Toolbar'
import Typography from 'material-ui-next/Typography'
import Divider from 'material-ui-next/Divider'
import List, {
  ListItem,
  ListItemIcon,
  ListItemText
} from 'material-ui-next/List'
import IconButton from 'material-ui-next/IconButton'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import ChevronRightIcon from 'material-ui-icons/ChevronRight'
import LayersIcon from 'material-ui-icons/Layers'
import DeviceHubIcon from 'material-ui-icons/DeviceHub'

export const SidebarLayout = ({
  title,
  classes,
  drawerOpen,
  toggleDrawer,
  children
}) => (
  <div className={classes.appFrame}>
    <AppBar
      className={classNames(classes.appBar, drawerOpen && classes.appBarShift)}>
      <Toolbar>
        <Typography type="title" color="inherit" noWrap>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
    <Drawer
      type="permanent"
      classes={{
        paper: classNames(
          classes.drawerPaper,
          !drawerOpen && classes.drawerPaperClose
        )
      }}
      open={drawerOpen}>
      <div className={classes.drawerInner}>
        <div className={classes.drawerHeader}>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List className={classes.list}>
          <ListItem button selected>
            <ListItemIcon>
              <LayersIcon />
            </ListItemIcon>
            <ListItemText primary="Environments" />
          </ListItem>
          <ListItem button selected>
            <ListItemIcon>
              <DeviceHubIcon />
            </ListItemIcon>
            <ListItemText primary="Migrations" />
          </ListItem>
          <Divider />
          <Divider />
          <ListItem button selected onClick={toggleDrawer}>
            <ListItemIcon>
              {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </ListItemIcon>
          </ListItem>
        </List>
      </div>
    </Drawer>
    <main className={classes.content}>
      {/* {React.cloneElement(children, { drawerOpen, toggleDrawer })} */}
      {children}
    </main>
  </div>
)

SidebarLayout.propTypes = {
  title: PropTypes.string,
  toggleDrawer: PropTypes.func,
  classes: PropTypes.object, // added by withStyles
  drawerOpen: PropTypes.bool,
  children: PropTypes.element.isRequired
}

export default SidebarLayout
