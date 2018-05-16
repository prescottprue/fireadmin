import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui/Table'
import classes from './PermissionsTable.scss'

export const PermissionsTable = ({ permissions }) => (
  <Paper>
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>Member Name</TableCell>
          <TableCell>Role</TableCell>
        </TableRow>
      </TableHead>
      <TableBody className={classes.body}>
        {permissions.map(({ permission, uid, displayName }, index) => (
          <TableRow
            key={`${uid}-${permission}`}
            className={classes.tableRowDivider}>
            <TableCell>
              <span>{displayName}</span>
            </TableCell>
            <TableCell>
              <span>{permission}</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>
)

PermissionsTable.propTypes = {
  permissions: PropTypes.array.isRequired
}

export default PermissionsTable
