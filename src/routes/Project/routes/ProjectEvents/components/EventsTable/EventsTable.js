import React from 'react'
import PropTypes from 'prop-types'
import { map, get, invoke, flatMap, startCase } from 'lodash'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { formatTime } from 'utils/formatters'

function EventsTable({ groupedEvents, classes }) {
  return (
    <Paper>
      <Table data-test="project-events">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Event Type</TableCell>
            <TableCell>Created By</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className={classes.body}>
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
                key={`Event-${eventKey}-${get(projectEvent, 'eventType', '')}`}
                data-test="event-row"
                data-test-id={eventKey}>
                <TableCell data-test="event-createdAt">
                  {formatTime(invoke(get(projectEvent, 'createdAt'), 'toDate'))}
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
  )
}

EventsTable.propTypes = {
  groupedEvents: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired // from enhancer (withStyles)
}

export default EventsTable
