import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import styles from './RecentActions.styles'

function NoRecentActions({ classes }) {
  return (
    <Paper className={classes.empty}>
      <span>No Recent Actions Found</span>
    </Paper>
  )
}

NoRecentActions.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(NoRecentActions)
