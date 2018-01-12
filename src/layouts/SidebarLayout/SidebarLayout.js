import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Drawer from 'material-ui-next/Drawer'
import AppBar from 'material-ui-next/AppBar'
import Toolbar from 'material-ui-next/Toolbar'
import Typography from 'material-ui-next/Typography'
import Divider from 'material-ui-next/Divider'
// import IconButton from 'material-ui-next/IconButton'
// import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
// import ChevronRightIcon from 'material-ui-icons/ChevronRight'
import LayersIcon from 'material-ui-icons/Layers'
import HomeIcon from 'material-ui-icons/Home'
import DeviceHubIcon from 'material-ui-icons/DeviceHub'
import StorageIcon from 'material-ui-icons/Dns'
import SidebarList from './SidebarList'

const sidebarOptions = [
  {
    value: '',
    label: 'Home',
    iconElement: <HomeIcon />
  },
  {
    value: 'environments',
    iconElement: <LayersIcon />
  },
  {
    value: 'migrations',
    iconElement: <DeviceHubIcon />
  },
  {
    value: 'bucketConfig',
    label: 'Bucket Config',
    iconElement: <StorageIcon />
  }
]

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
          {title || 'Project'}
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
          {/* <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton> */}
        </div>
        <Divider />
        <SidebarList
          optionsConfig={sidebarOptions}
          toggleDrawer={toggleDrawer}
          drawerOpen={drawerOpen}
        />
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
