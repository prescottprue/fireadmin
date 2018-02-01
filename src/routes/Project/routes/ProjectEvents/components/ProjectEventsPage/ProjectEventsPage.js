import React from 'react'
import PropTypes from 'prop-types'
import { map, get, flatMap } from 'lodash'
import Typography from 'material-ui-next/Typography'
import Paper from 'material-ui-next/Paper'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui-next/Table'
import { formatTime } from 'utils/formatters'
import classes from './ProjectEventsPage.scss'

export const ProjectEventsPage = ({ groupedEvents }) => (
  <div className={classes.container}>
    <Typography className={classes.pageHeader}>Project Events</Typography>
    <div className={classes.content}>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Event Type</TableCell>
              <TableCell>Created By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
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
                  <TableCell>{formatTime(projectEvent.createdAt)}</TableCell>
                  <TableCell>{get(projectEvent, 'eventType')}</TableCell>
                  <TableCell>
                    <span>{projectEvent.createdBy}</span>
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

ProjectEventsPage.propTypes = {
  groupedEvents: PropTypes.object
}

export default ProjectEventsPage
