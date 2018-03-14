import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import { get, map, startCase } from 'lodash'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui/Table'
import IconButton from 'material-ui/IconButton'
import Tooltip from 'material-ui/Tooltip'
import RedoIcon from 'material-ui-icons/Redo'
import { formatDateTime } from 'utils/formatters'
import classes from './RecentActions.scss'

export const RecentActions = ({
  orderedActions,
  rerunAction,
  actionToEnvironments
}) => (
  <div className={classes.container}>
    <Paper>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Created By</TableCell>
            <TableCell>Template</TableCell>
            <TableCell>Source/Dest</TableCell>
            <TableCell>Path</TableCell>
            <TableCell>Redo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {map(orderedActions, (action, groupName) => [
            <TableRow key={groupName} className={classes.tableRowDivider}>
              <TableCell>{formatDateTime(action.createdAt)}</TableCell>
              <TableCell>
                <span>
                  {action.createdBy || startCase(action.createdByType)}
                </span>
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
                <span>{get(action, 'eventData.inputValues.2', 'No Path')}</span>
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
  </div>
)

RecentActions.propTypes = {
  orderedActions: PropTypes.array,
  actionToEnvironments: PropTypes.func.isRequired,
  rerunAction: PropTypes.func.isRequired
}

export default RecentActions
