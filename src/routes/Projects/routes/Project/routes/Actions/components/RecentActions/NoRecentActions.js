import React from 'react'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import styles from './RecentActions.styles'

const useStyles = makeStyles(styles)

export default function NoRecentActions() {
  const classes = useStyles()
  return (
    <Paper className={classes.empty} data-test="no-recent-actions">
      <span>No Recent Actions Found</span>
    </Paper>
  )
}
