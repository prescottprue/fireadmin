import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import { map, startCase } from 'lodash'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui/Table'
import IconButton from 'material-ui/IconButton'
import Tooltip from 'material-ui/Tooltip'
import RedoIcon from 'material-ui-icons/Redo'
import { formatTime } from 'utils/formatters'
import classes from './RecentActions.scss'

export const RecentActions = ({ recentActions, rerunAction }) => (
  <div className={classes.container}>
    <Paper>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Created By</TableCell>
            <TableCell>Redo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {map(recentActions, (action, groupName) => [
            <TableRow key={groupName} className={classes.tableRowDivider}>
              <TableCell>{formatTime(action.createdAt)}</TableCell>
              <TableCell>
                <span>
                  {action.createdBy || startCase(action.createdByType)}
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
  </div>
)

RecentActions.propTypes = {
  recentActions: PropTypes.object,
  rerunAction: PropTypes.func.isRequired
}

export default RecentActions
