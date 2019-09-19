import React from 'react'
import PropTypes from 'prop-types'
import Navbar from 'containers/Navbar'
import { Notifications } from 'modules/notification'
import VersionChangeReloader from 'components/VersionChangeReloader'

function CoreLayout({ children, classes }) {
  return (
    <div className={classes.root}>
      <Navbar />
      <div className={classes.children}>{children}</div>
      <Notifications />
      <VersionChangeReloader />
    </div>
  )
}

CoreLayout.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  children: PropTypes.element.isRequired
}

export default CoreLayout
