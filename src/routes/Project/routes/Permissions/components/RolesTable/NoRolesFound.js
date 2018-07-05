import React from 'react'
import Paper from '@material-ui/core/Paper'
import classes from './RolesTable.scss'

export const NoRolesFound = () => (
  <Paper className={classes.empty}>
    <div className="flex-row-center">No Roles found</div>
  </Paper>
)

export default NoRolesFound
