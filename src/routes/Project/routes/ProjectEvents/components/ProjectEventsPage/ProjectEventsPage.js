import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import EventsTable from '../EventsTable'
import classes from './ProjectEventsPage.scss'

function ProjectEventsPage({ groupedEvents }) {
  return (
    <div className={classes.container}>
      <Typography className={classes.pageHeader}>Project Events</Typography>
      <div className={classes.content}>
        <EventsTable groupedEvents={groupedEvents} />
      </div>
    </div>
  )
}

ProjectEventsPage.propTypes = {
  groupedEvents: PropTypes.object
}

export default ProjectEventsPage
