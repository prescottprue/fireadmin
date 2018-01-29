import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import Typography from 'material-ui-next/Typography'
import Paper from 'material-ui-next/Paper'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui-next/Table'
import classes from './ProjectEventsPage.scss'

export const ProjectEventsPage = ({ project }) => (
  <div>
    <Typography className={classes.pageHeader}>Project Events</Typography>
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Event Id</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Created By</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {map(project.events, (projectEvent, eventKey) => {
            return (
              <TableRow key={eventKey}>
                <TableCell>{eventKey}</TableCell>
                <TableCell>{JSON.stringify(projectEvent.createdAt)}</TableCell>
                <TableCell>
                  <span>{projectEvent.createdBy}</span>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Paper>
  </div>
)

ProjectEventsPage.propTypes = {
  project: PropTypes.object
}

export default ProjectEventsPage
