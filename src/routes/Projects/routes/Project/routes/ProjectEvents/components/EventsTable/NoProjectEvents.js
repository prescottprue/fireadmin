import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'

function NoProjectEvents({ groupedEvents, classes }) {
  return (
    <Paper className={classes.empty} data-test="no-project-events">
      <Typography className={classes.emptyHeader}>
        No Project Events Exist
      </Typography>
      <Typography>
        Events track all updates/changes to your project. Go ahead a try doing
        something with the project such as creating an environment
      </Typography>
    </Paper>
  )
}

NoProjectEvents.propTypes = {
  groupedEvents: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired // from enhancer (withStyles)
}

const styles = (theme) => ({
  empty: {
    ...theme.flexColumnCenter,
    padding: '3rem'
  },
  emptyHeader: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '1.5rem'
  }
})

export default withStyles(styles, { withTheme: true })(NoProjectEvents)
