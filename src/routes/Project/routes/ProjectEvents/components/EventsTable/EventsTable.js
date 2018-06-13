import React from 'react'
import PropTypes from 'prop-types'
import { map, get, flatMap, startCase } from 'lodash'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { formatTime } from 'utils/formatters'
import classes from './EventsTable.scss'

export const EventsTable = ({ groupedEvents }) => (
  <Paper>
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>Time</TableCell>
          <TableCell>Event Type</TableCell>
          <TableCell>Created By</TableCell>
        </TableRow>
      </TableHead>
      <TableBody className={classes.body}>
        {flatMap(groupedEvents, (eventGroup, groupName) => [
          <TableRow key={groupName} className={classes.tableRowDivider}>
            <TableCell>
              <span>{groupName}</span>
            </TableCell>
            <TableCell />
            <TableCell />
          </TableRow>,
          map(eventGroup, (projectEvent, eventKey) => (
            <TableRow key={eventKey}>
              <TableCell>
                {formatTime(projectEvent.createdAt.toDate())}
              </TableCell>
              <TableCell>
                {startCase(get(projectEvent, 'eventType', ''))}
              </TableCell>
              <TableCell>
                <span>
                  {projectEvent.createdBy ||
                    startCase(projectEvent.createdByType)}
                </span>
              </TableCell>
            </TableRow>
          ))
        ])}
      </TableBody>
    </Table>
  </Paper>
)

EventsTable.propTypes = {
  groupedEvents: PropTypes.object
}

export default EventsTable
