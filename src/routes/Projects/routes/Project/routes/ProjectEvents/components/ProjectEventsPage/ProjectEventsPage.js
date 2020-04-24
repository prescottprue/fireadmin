import React from 'react'
import PropTypes from 'prop-types'
import { map, get, flatMap, startCase, groupBy } from 'lodash'
import {
  useFirestore,
  useFirestoreCollectionData,
  useDatabase,
  useDatabaseObjectData
} from 'reactfire'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { makeStyles } from '@material-ui/core/styles'
import { formatTime, formatDate } from 'utils/formatters'
import Typography from '@material-ui/core/Typography'
import { PROJECTS_COLLECTION } from 'constants/firebasePaths'
import styles from './ProjectEventsPage.styles'

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
  const projectEvents = useFirestoreCollectionData(projectEventsRef)
  const displayNames = useDatabaseObjectData(displayNamesRef)
  // Populate project events with display names
  const events = map(projectEvents, (event) => {
    const createdBy = get(event, 'createdBy')
    if (createdBy) {
      return {
        ...event,
        createdBy: get(displayNames, createdBy, createdBy)
      }
    }
    return event
  })

  // Group events by createdAt date
  const groupedEvents = groupBy(events, (event) => {
    const createdAt = get(event, 'createdAt')
    return formatDate(createdAt.toDate ? createdAt.toDate() : createdAt)
  })

  return (
    <div className={classes.container}>
      <Typography className={classes.pageHeader}>Project Events</Typography>
      <div className={classes.content}>
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
                    key={`Event-${eventKey}-${get(
                      projectEvent,
                      'eventType',
                      ''
                    )}`}
                    data-test="event-row"
                    data-test-id={eventKey}>
                    <TableCell data-test="event-createdAt">
                      {formatTime(get(projectEvent, 'createdAt'))}
                    </TableCell>
                    <TableCell>
                      {startCase(get(projectEvent, 'eventType', ''))}
                    </TableCell>
                    <TableCell>
                      <span>
                        {get(projectEvent, 'createdBy') ||
                          startCase(get(projectEvent, 'createdByType'))}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ])}
            </TableBody>
          </Table>
        </Paper>
      </div>
    </div>
  )
}

ProjectEventsPage.propTypes = {
  projectId: PropTypes.string.isRequired
}

export default ProjectEventsPage
