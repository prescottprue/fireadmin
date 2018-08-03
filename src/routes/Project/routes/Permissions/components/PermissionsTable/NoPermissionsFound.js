import React from 'react'
import Paper from '@material-ui/core/Paper'
import classes from './PermissionsTable.scss'

export const NoPermissionsFound = () => (
  <Paper className={classes.empty}>
    <div className="flex-row-center">No Members found</div>
  </Paper>
)

export default NoPermissionsFound
