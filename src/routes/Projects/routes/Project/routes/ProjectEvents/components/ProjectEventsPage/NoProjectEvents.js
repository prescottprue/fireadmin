import React from 'react'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

import styles from './ProjectEventsPage.styles'

const useStyles = makeStyles(styles)

function NoProjectEvents() {
  const classes = useStyles()
  return (
    <Paper className={classes.empty} data-test="no-project-events">
      <span>No Project Events Found</span>
    </Paper>
  )
}

export default NoProjectEvents
