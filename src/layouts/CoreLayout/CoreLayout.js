import React from 'react'
import PropTypes from 'prop-types'
import Navbar from 'containers/Navbar'
import { Notifications } from 'modules/notification'
import VersionChangeReloader from 'components/VersionChangeReloader'
import classes from './CoreLayout.scss'
import 'styles/core.scss'

const CoreLayout = ({ children }) => (
  <div className={classes.container}>
    <Navbar />
    <div className={classes.children}>{children}</div>
    <Notifications />
    <VersionChangeReloader />
  </div>
)

CoreLayout.propTypes = {
  children: PropTypes.element.isRequired
}

export default CoreLayout
