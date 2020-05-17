import React from 'react'
import PropTypes from 'prop-types'
import { map, flatMap, startCase, groupBy } from 'lodash'
import {
  useFirestore,
  useFirestoreCollection,
  useDatabase,
  useDatabaseObjectData
} from 'reactfire'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { formatTime, formatDate } from 'utils/formatters'
import { PROJECTS_COLLECTION } from 'constants/firebasePaths'
import NoProjectEvents from './NoProjectEvents'
import styles from './ProjectEventsPage.styles'
import LoadingSpinner from 'components/LoadingSpinner'

const useStyles = makeStyles(styles)

function ProjectEventsPage({ projectId }) {
  const classes = useStyles()
  const firestore = useFirestore()
  const database = useDatabase()
  const displayNamesRef = database.ref('displayNames')
  const projectEventsRef = firestore
    .collection(`${PROJECTS_COLLECTION}/${projectId}/events`)
    .orderBy('createdAt', 'desc')
    .limit(200)
  const projectEventsSnap = useFirestoreCollection(projectEventsRef, {
    idField: 'id'
  })
  const displayNames = useDatabaseObjectData(displayNamesRef)
  // Populate project events with display names
  const events = projectEventsSnap.docs.map((eventDoc) => {
    const event = eventDoc.data()
    const createdBy = event?.createdBy
    if (displayNames && createdBy) {
      return {
        ...event,
        createdBy: displayNames[createdBy] || createdBy
      }
    }
    return event
  })

  // Group events by createdAt date
  const groupedEvents = groupBy(events, (event) => {
    const { createdAt } = event
    return formatDate(createdAt.toDate ? createdAt.toDate() : createdAt)
  })

  return (
    <div className={classes.container}>
      <Typography className={classes.pageHeader}>Project Events</Typography>
      <div className={classes.content}>
        {projectEventsSnap.metadata.fromCache ? (
          <LoadingSpinner />
        ) : !projectEventsSnap.docs.length ? (
          <NoProjectEvents />
        ) : (
          <Paper>
            <Table data-test="project-events">
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Event Type</TableCell>
                  <TableCell>Created By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.tableBody}>
                {flatMap(groupedEvents, (eventGroup, groupName) => [
                  <TableRow
                    key={groupName}
                    className={classes.tableRowDivider}
                    data-test="event-date-divider">
                    <TableCell data-test="event-date-divider-value">
                      {groupName}
                    </TableCell>
                    <TableCell />
                    <TableCell />
                  </TableRow>,
                  map(eventGroup, (projectEvent, eventKey) => (
                    <TableRow
                      key={`Event-${eventKey}-${projectEvent?.eventType || ''}`}
                      data-test="event-row"
                      data-test-id={eventKey}>
                      <TableCell data-test="event-createdAt">
                        {formatTime(projectEvent?.createdAt)}
                      </TableCell>
                      <TableCell>
                        {startCase(projectEvent?.eventType || '')}
                      </TableCell>
                      <TableCell>
                        <span>
                          {projectEvent?.createdBy ||
                            startCase(projectEvent?.createdByType || '')}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ])}
              </TableBody>
            </Table>
          </Paper>
        )}
      </div>
    </div>
  )
}

ProjectEventsPage.propTypes = {
  projectId: PropTypes.string.isRequired
}

export default ProjectEventsPage
