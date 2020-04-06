import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/core/styles'
import SidebarList from './SidebarList'
import styles from './SidebarLayout.styles'

const useStyles = makeStyles(styles)

function SidebarLayout({ title, children }) {
  const classes = useStyles()
  const [drawerOpen, changeDrawerState] = useState(false)
  function toggleDrawer(action) {
    changeDrawerState(!drawerOpen)
  }
  return (
    <div className={classes.appFrame}>
      <AppBar
        className={classNames(
          classes.appBar,
          drawerOpen && classes.appBarShift
        )}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
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
          <SidebarList toggleDrawer={toggleDrawer} drawerOpen={drawerOpen} />
        </div>
      </Drawer>
      <main className={classes.content}>
        {/* {React.cloneElement(children, { drawerOpen, toggleDrawer })} */}
        {children}
      </main>
    </div>
  )
}

SidebarLayout.propTypes = {
  children: PropTypes.element.isRequired,
  title: PropTypes.string
}

export default SidebarLayout
