import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import classes from './ProjectEventsPage.scss'

export const NoProjectEvents = ({ groupedEvents }) => (
  <Paper className={classes.empty}>
    <Typography className={classes.emptyHeader}>
      No Project Events Exist
    </Typography>
    <Typography>
      Events track all updates/changes to your project. Go ahead a try doing
      something with the project such as creating an environment
    </Typography>
  </Paper>
)

NoProjectEvents.propTypes = {
  groupedEvents: PropTypes.object
}

export default NoProjectEvents
