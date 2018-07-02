import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import Paper from '@material-ui/core/Paper'
import PermissionsTableRow from '../PermissionsTableRow'
import classes from './PermissionsTable.scss'
import { formNames } from 'constants'

export const PermissionsTable = ({
  collaborators,
  updatePermissions,
  projectId,
  removeMember
}) => (
  <Paper>
    <div className={classes.table}>
      <div className={classes.header}>
        <span className={classes.headerLeft}>Member</span>
        <span>Role</span>
      </div>
      {map(collaborators, ({ role, uid, displayName }, index) => (
        <PermissionsTableRow
          key={`${uid}-${role}`}
          uid={uid}
          role={role}
          displayName={displayName}
          onSubmit={updatePermissions}
          projectId={projectId}
          form={`${formNames.projectPermissions}.${uid}`}
          initialValues={{ [uid]: { role } }}
          onMemberRemoveClick={removeMember}
        />
      ))}
    </div>
  </Paper>
)

PermissionsTable.propTypes = {
  collaborators: PropTypes.array.isRequired,
  projectId: PropTypes.string.isRequired,
  updatePermissions: PropTypes.func.isRequired, // from enhancer (withHandlers)
  removeMember: PropTypes.func.isRequired // from enhancer (withHandlers)
}

export default PermissionsTable
