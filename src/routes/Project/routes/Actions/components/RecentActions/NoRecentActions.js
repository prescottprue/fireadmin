import React from 'react'
import Paper from '@material-ui/core/Paper'
import classes from './RecentActions.scss'

export const NoRecentActions = () => (
  <Paper className={classes.empty}>
    <span>No Recent Actions Found</span>
  </Paper>
)

export default NoRecentActions
