import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import { get, map, startCase, invoke } from 'lodash'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import RedoIcon from '@material-ui/icons/Redo'
import { formatDateTime } from 'utils/formatters'
import classes from './RecentActions.scss'

export const RecentActions = ({
  orderedActions,
  rerunAction,
  actionToEnvironments
}) => (
  <Paper className={classes.container}>
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>Time</TableCell>
          <TableCell>Created By</TableCell>
          <TableCell>Template</TableCell>
          <TableCell>Source/Dest</TableCell>
          <TableCell>Input 1 Value</TableCell>
          <TableCell>Redo</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {map(orderedActions, (action, groupName) => [
          <TableRow key={groupName} className={classes.tableRowDivider}>
            <TableCell>
              {formatDateTime(invoke(action, 'createdAt.toDate'))}
            </TableCell>
            <TableCell>
              <span>{action.createdBy || startCase(action.createdByType)}</span>
            </TableCell>
            <TableCell>
              <span>{get(action, 'eventData.template.name', 'No Name')}</span>
            </TableCell>
            <TableCell>
              <span>
                Source: {actionToEnvironments(action).src}
                <br />
                Dest: {actionToEnvironments(action).dest}
              </span>
            </TableCell>
            <TableCell>
              <span>
                {get(
                  action,
                  'eventData.inputValues.2',
                  get(action, 'eventData.inputValues.0', 'No Path')
                )}
              </span>
            </TableCell>
            <TableCell>
              <Tooltip
                title={
                  <div>
                    <span style={{ marginLeft: '.3rem' }}>Rerun Action</span>
                    <br />
                    <span>(Same Settings)</span>
                  </div>
                }>
                <IconButton
                  onClick={() => rerunAction(action)}
                  color="secondary"
                  className={classes.submit}>
                  <RedoIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ])}
      </TableBody>
    </Table>
  </Paper>
)

RecentActions.propTypes = {
  orderedActions: PropTypes.array,
  actionToEnvironments: PropTypes.func.isRequired,
  rerunAction: PropTypes.func.isRequired
}

export default RecentActions
