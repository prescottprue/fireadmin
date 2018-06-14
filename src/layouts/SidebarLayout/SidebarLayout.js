import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import SidebarList from './SidebarList'
import sidebarOptions from './sidebarOptions'

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
        <Typography variant="title" color="inherit" noWrap>
          {title || 'Project'}
        </Typography>
      </Toolbar>
    </AppBar>
    <Drawer
      variant="permanent"
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
  classes: PropTypes.object, // from enhancer (withStyles)
  drawerOpen: PropTypes.bool,
  children: PropTypes.element.isRequired
}

export default SidebarLayout
