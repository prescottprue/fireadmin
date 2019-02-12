import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import EventsTable from '../EventsTable'

function ProjectEventsPage({ projectEvents, classes }) {
  return (
    <div className={classes.container}>
      <Typography className={classes.pageHeader}>Project Events</Typography>
      <div className={classes.content}>
        <EventsTable groupedEvents={projectEvents} />
      </div>
    </div>
  )
}

ProjectEventsPage.propTypes = {
  projectEvents: PropTypes.object,
  classes: PropTypes.object.isRequired
}

export default ProjectEventsPage
