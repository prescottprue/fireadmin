import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Navbar from 'containers/Navbar'
import { SuspenseWithPerf } from 'reactfire'
import NavbarWithoutAuth from 'containers/Navbar/NavbarWithoutAuth'
import { Notifications } from 'modules/notification'
import VersionChangeReloader from 'components/VersionChangeReloader'
import styles from './CoreLayout.styles'
import SetupFirestore from 'components/SetupFirestore'

const useStyles = makeStyles(styles)

function CoreLayout({ children }) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <SuspenseWithPerf traceId="setup-firestore">
        <SetupFirestore />
      </SuspenseWithPerf>
      <SuspenseWithPerf fallback={<NavbarWithoutAuth />} traceId="load-navbar">
        <Navbar />
      </SuspenseWithPerf>
      <div className={classes.children}>{children}</div>
      <Notifications />
      <SuspenseWithPerf traceId="load-version-change">
        <VersionChangeReloader />
      </SuspenseWithPerf>
    </div>
  )
}

CoreLayout.propTypes = {
  children: PropTypes.element.isRequired
}

export default CoreLayout
