import React from 'react'
import PropTypes from 'prop-types'
import Navbar from 'containers/Navbar'
import classes from './CoreLayout.scss'
import { Notifications } from 'modules/notification'
import VersionChangeReloader from 'components/VersionChangeReloader'
import 'styles/core.scss'

export const CoreLayout = ({ children }) => (
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
