import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Navbar from 'containers/Navbar'
import { Notifications } from 'modules/notification'
import VersionChangeReloader from 'components/VersionChangeReloader'
import styles from './CoreLayout.styles'

const useStyles = makeStyles(styles)

function CoreLayout({ children }) {
  const classes = useStyles()

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
  children: PropTypes.element.isRequired
}

export default CoreLayout
