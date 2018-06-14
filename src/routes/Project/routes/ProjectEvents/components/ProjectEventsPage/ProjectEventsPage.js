import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import EventsTable from '../EventsTable'
import classes from './ProjectEventsPage.scss'

export const ProjectEventsPage = ({ groupedEvents }) => (
  <div className={classes.container}>
    <Typography className={classes.pageHeader}>Project Events</Typography>
    <div className={classes.content}>
      {groupedEvents ? (
        <EventsTable groupedEvents={groupedEvents} />
      ) : (
        <Paper className={classes.empty}>
          <Typography className={classes.emptyHeader}>
            No Project Events Exist
          </Typography>
          <Typography>
            Events track all updates/changes to your project. Go ahead a try
            doing something with the project such as creating an environment
          </Typography>
        </Paper>
      )}
    </div>
  </div>
)

ProjectEventsPage.propTypes = {
  groupedEvents: PropTypes.object
}

export default ProjectEventsPage
