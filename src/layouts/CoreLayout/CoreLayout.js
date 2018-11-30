import React from 'react'
import PropTypes from 'prop-types'
import Navbar from 'containers/Navbar'
import { Notifications } from 'modules/notification'
import VersionChangeReloader from 'components/VersionChangeReloader'
import classes from './CoreLayout.scss'

function CoreLayout({ children }) {
  return (
    <div className={classes.container}>
      <Navbar />
      <div className={classes.children}>{children}</div>
      <Notifications />
      <VersionChangeReloader />
    </div>
  )
}

CoreLayout.propTypes = {
  children: PropTypes.element.isRequired
}

export default CoreLayout
